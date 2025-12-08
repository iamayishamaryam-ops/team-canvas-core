import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Building2, CreditCard, Save, Loader2 } from "lucide-react";
import { useMyProfile, useUpdateMyProfile } from "@/hooks/useProfile";
import { useMyBankDetails, useUpsertBankDetails } from "@/hooks/useBankDetails";
import { useAuth } from "@/hooks/useAuth";

const Settings = () => {
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: bankDetails, isLoading: bankLoading } = useMyBankDetails();
  const updateProfile = useUpdateMyProfile();
  const upsertBankDetails = useUpsertBankDetails();
  const { user, role } = useAuth();

  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
    department: "",
    position: "",
  });

  const [bankForm, setBankForm] = useState({
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    iban: "",
    swift_code: "",
    branch_name: "",
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        department: profile.department || "",
        position: profile.position || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (bankDetails) {
      setBankForm({
        bank_name: bankDetails.bank_name || "",
        account_holder_name: bankDetails.account_holder_name || "",
        account_number: bankDetails.account_number || "",
        iban: bankDetails.iban || "",
        swift_code: bankDetails.swift_code || "",
        branch_name: bankDetails.branch_name || "",
      });
    }
  }, [bankDetails]);

  const handleProfileSave = () => {
    updateProfile.mutate(profileForm);
  };

  const handleBankSave = () => {
    if (user) {
      upsertBankDetails.mutate({
        user_id: user.id,
        ...bankForm,
      });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your profile and account settings</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="profile" className="data-[state=active]:bg-background">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="bank" className="data-[state=active]:bg-background">
              <CreditCard className="h-4 w-4 mr-2" />
              Bank Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 animate-fade-in">
            {/* Profile Header Card */}
            <Card>
              <CardContent className="p-6">
                {profileLoading ? (
                  <div className="flex items-center gap-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24 border-4 border-border">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {getInitials(profile?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{profile?.full_name || "No name set"}</h2>
                      <p className="text-muted-foreground">{profile?.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-muted-foreground capitalize">{role || "employee"}</span>
                        {profile?.department && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{profile.department}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profileLoading ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={profileForm.department}
                          onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                          placeholder="Enter your department"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          value={profileForm.position}
                          onChange={(e) => setProfileForm({ ...profileForm, position: e.target.value })}
                          placeholder="Enter your position"
                        />
                      </div>
                    </div>
                    <Button onClick={handleProfileSave} disabled={updateProfile.isPending}>
                      {updateProfile.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Bank Account Details
                </CardTitle>
                <CardDescription>Your bank details for salary payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {bankLoading ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="bank_name">Bank Name</Label>
                        <Input
                          id="bank_name"
                          value={bankForm.bank_name}
                          onChange={(e) => setBankForm({ ...bankForm, bank_name: e.target.value })}
                          placeholder="Enter bank name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account_holder_name">Account Holder Name</Label>
                        <Input
                          id="account_holder_name"
                          value={bankForm.account_holder_name}
                          onChange={(e) => setBankForm({ ...bankForm, account_holder_name: e.target.value })}
                          placeholder="Enter account holder name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account_number">Account Number</Label>
                        <Input
                          id="account_number"
                          value={bankForm.account_number}
                          onChange={(e) => setBankForm({ ...bankForm, account_number: e.target.value })}
                          placeholder="Enter account number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="iban">IBAN</Label>
                        <Input
                          id="iban"
                          value={bankForm.iban}
                          onChange={(e) => setBankForm({ ...bankForm, iban: e.target.value })}
                          placeholder="Enter IBAN"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="swift_code">SWIFT/BIC Code</Label>
                        <Input
                          id="swift_code"
                          value={bankForm.swift_code}
                          onChange={(e) => setBankForm({ ...bankForm, swift_code: e.target.value })}
                          placeholder="Enter SWIFT code"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="branch_name">Branch Name</Label>
                        <Input
                          id="branch_name"
                          value={bankForm.branch_name}
                          onChange={(e) => setBankForm({ ...bankForm, branch_name: e.target.value })}
                          placeholder="Enter branch name"
                        />
                      </div>
                    </div>
                    <Button onClick={handleBankSave} disabled={upsertBankDetails.isPending}>
                      {upsertBankDetails.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Bank Details
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
