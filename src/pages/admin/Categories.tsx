import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { supabase, resolveImageUrl } from "@/lib/supabaseClient";
import { showError, showSuccess } from "@/utils/toast";

type CategoryRow = {
  id: string;
  name: string;
  image_path: string | null;
  image_url: string | null;
};

type CategoryFormState = {
  id?: string;
  name: string;
  image_path: string;
  image_url: string;
};

const emptyForm: CategoryFormState = {
  name: "",
  image_path: "",
  image_url: "",
};

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Array<{ id: string; name: string; image: string }>>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formValues, setFormValues] = useState<CategoryFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, image_path, image_url")
      .order("name");

    if (error) {
      showError("Failed to load categories.");
      setLoading(false);
      return;
    }

    setCategories(
      (data as CategoryRow[]).map((category) => ({
        id: category.id,
        name: category.name,
        image: resolveImageUrl("restaurants", category.image_path, category.image_url),
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      await fetchCategories();
    };
    if (active) {
      loadData();
    }
    return () => {
      active = false;
    };
  }, []);

  const filteredCategories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return categories;
    return categories.filter((category) => category.name.toLowerCase().includes(normalized));
  }, [categories, query]);

  const openCreateForm = () => {
    setFormMode("create");
    setFormValues(emptyForm);
    setFormError(null);
    setFormOpen(true);
  };

  const openEditForm = async (categoryId: string) => {
    setFormMode("edit");
    setFormError(null);
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, image_path, image_url")
      .eq("id", categoryId)
      .single();

    if (error || !data) {
      showError("Unable to load category details.");
      return;
    }

    setFormValues({
      id: data.id,
      name: data.name || "",
      image_path: data.image_path || "",
      image_url: data.image_url || "",
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    setFormError(null);
    if (!formValues.name.trim()) {
      setFormError("Name is required.");
      return;
    }

    setSaving(true);
    const payload = {
      name: formValues.name.trim(),
      image_path: formValues.image_path.trim() || null,
      image_url: formValues.image_url.trim() || null,
    };

    if (formMode === "create") {
      const { error } = await supabase.from("categories").insert(payload);
      if (error) {
        setFormError(error.message);
        showError("Unable to create category.");
        setSaving(false);
        return;
      }
      showSuccess("Category created.");
    } else {
      const { error } = await supabase.from("categories").update(payload).eq("id", formValues.id);
      if (error) {
        setFormError(error.message);
        showError("Unable to update category.");
        setSaving(false);
        return;
      }
      showSuccess("Category updated.");
    }

    setSaving(false);
    setFormOpen(false);
    await fetchCategories();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("categories").delete().eq("id", deleteTarget.id);
    if (error) {
      showError("Unable to delete category.");
      return;
    }
    showSuccess("Category deleted.");
    setDeleteTarget(null);
    await fetchCategories();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Categories</h1>
          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-muted-foreground">
                      Loading categories...
                    </TableCell>
                  </TableRow>
                )}
                {!loading && filteredCategories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-muted-foreground">
                      No categories found.
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold">{category.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {category.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditForm(category.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTarget({ id: category.id, name: category.name })}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{formMode === "create" ? "Add Category" : "Edit Category"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formValues.name}
                onChange={(event) => setFormValues((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Category name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image path</label>
              <Input
                value={formValues.image_path}
                onChange={(event) => setFormValues((prev) => ({ ...prev, image_path: event.target.value }))}
                placeholder="placeholders/default.svg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={formValues.image_url}
                onChange={(event) => setFormValues((prev) => ({ ...prev, image_url: event.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {deleteTarget?.name || "this category"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Categories;
