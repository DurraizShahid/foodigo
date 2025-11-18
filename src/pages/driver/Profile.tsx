"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { User, Car, FileText, Camera, Save } from "lucide-react";
import { toast } from "sonner";

const DriverProfile: React.FC = () => {
  const [profile, setProfile] = useState({
    name: "John Driver",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    licenseNumber: "DL123456",
    vehicleType: "bike",
    vehicleModel: "Honda CB500X",
    vehiclePlate: "ABC-1234",
  });

  const [documents, setDocuments] = useState([
    { id: "1", type: "Driver License", status: "Verified", uploadedAt: "2024-01-15" },
    { id: "2", type: "Vehicle Registration", status: "Verified", uploadedAt: "2024-01-15" },
    { id: "3", type: "Insurance", status: "Pending", uploadedAt: "2024-01-20" },
  ]);

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const handleUploadDocument = (type: string) => {
    toast.info(`Uploading ${type}...`);
    // In real app, this would trigger file upload
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Driver Profile</h1>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">Driver License Number</Label>
                  <Input
                    id="license"
                    value={profile.licenseNumber}
                    onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <Button variant="outline">Upload Photo</Button>
                    <p className="text-sm text-muted-foreground mt-2">Profile picture</p>
                  </div>
                </div>
                <Button onClick={handleSaveProfile} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicle">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Information
                </CardTitle>
                <CardDescription>Update your vehicle details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select
                    value={profile.vehicleType}
                    onValueChange={(value) => setProfile({ ...profile, vehicleType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bike">Bike / Motorcycle</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="scooter">Scooter</SelectItem>
                      <SelectItem value="bicycle">Bicycle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">Vehicle Model</Label>
                  <Input
                    id="vehicleModel"
                    value={profile.vehicleModel}
                    onChange={(e) => setProfile({ ...profile, vehicleModel: e.target.value })}
                    placeholder="e.g., Honda CB500X"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehiclePlate">License Plate</Label>
                  <Input
                    id="vehiclePlate"
                    value={profile.vehiclePlate}
                    onChange={(e) => setProfile({ ...profile, vehiclePlate: e.target.value })}
                    placeholder="ABC-1234"
                  />
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                    <Car className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div>
                    <Button variant="outline">Upload Vehicle Photo</Button>
                    <p className="text-sm text-muted-foreground mt-2">Vehicle registration photo</p>
                  </div>
                </div>
                <Button onClick={handleSaveProfile} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Vehicle Info
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Required Documents
                </CardTitle>
                <CardDescription>Upload and manage your verification documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{doc.type}</p>
                        <p className="text-sm text-muted-foreground">
                          Uploaded: {doc.uploadedAt} • Status:{" "}
                          <span
                            className={
                              doc.status === "Verified"
                                ? "text-green-600 font-medium"
                                : "text-yellow-600 font-medium"
                            }
                          >
                            {doc.status}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {doc.status === "Pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUploadDocument(doc.type)}
                          >
                            Re-upload
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-4">
                    All documents must be verified before you can start accepting deliveries.
                  </p>
                  <Button variant="outline" className="w-full">
                    Upload New Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DriverProfile;

