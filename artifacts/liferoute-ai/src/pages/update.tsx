import { useState, useEffect, useMemo } from "react";
import { useSearch, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Activity, Save, AlertCircle, Plus, RotateCcw } from "lucide-react";
import { useCity } from "@/context/city-context";
import { useHospitalStore } from "@/context/hospital-store";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CITY_LIST = [
  "Madurai", "Chennai", "Bengaluru", "Mumbai", "Delhi",
  "Hyderabad", "Kochi", "Coimbatore", "Pune", "Kolkata",
];

const CITY_STATE_MAP: Record<string, string> = {
  Madurai: "Tamil Nadu",
  Chennai: "Tamil Nadu",
  Coimbatore: "Tamil Nadu",
  Bengaluru: "Karnataka",
  Mumbai: "Maharashtra",
  Pune: "Maharashtra",
  Delhi: "Delhi",
  Hyderabad: "Telangana",
  Kochi: "Kerala",
  Kolkata: "West Bengal",
};

const ALL_SPECIALTIES = [
  "Trauma Care", "Cardiology", "Neurology", "Emergency Ward",
  "ICU", "Blood Bank", "Ventilator", "Kidney Care",
  "Liver Care", "Operation Theatre", "Pediatrics", "Orthopedics",
];

// ── Update form schema ──────────────────────────────────────────────
const updateSchema = z.object({
  hospitalId: z.string().min(1, "Please select a hospital"),
  status: z.enum(["Available", "Limited", "Full"]),
  emergencyLevel: z.enum(["Low", "Medium", "High", "Critical"]).nullable(),
  bedsAvailable: z.coerce.number().min(0),
  icuAvailable: z.coerce.number().min(0),
  ventilatorsAvailable: z.coerce.number().min(0),
  bloodUnitsAvailable: z.string().nullable(),
  specialties: z.array(z.string()),
  contactNumber: z.string().min(5, "Contact number is required"),
});

type UpdateFormValues = z.infer<typeof updateSchema>;

// ── Add hospital form schema ────────────────────────────────────────
const addSchema = z.object({
  name: z.string().min(3, "Hospital name is required"),
  city: z.string().min(1, "City is required"),
  customCity: z.string().optional(),
  state: z.string().min(1, "State is required"),
  area: z.string().min(2, "Area is required"),
  status: z.enum(["Available", "Limited", "Full"]),
  emergencyLevel: z.enum(["Low", "Medium", "High", "Critical"]).nullable(),
  bedsAvailable: z.coerce.number().min(0),
  icuAvailable: z.coerce.number().min(0),
  ventilatorsAvailable: z.coerce.number().min(0),
  bloodUnitsAvailable: z.string().optional(),
  specialties: z.array(z.string()),
  contactNumber: z.string().min(5, "Contact number is required"),
});

type AddFormValues = z.infer<typeof addSchema>;

// ── Update Panel Tab ────────────────────────────────────────────────
function UpdateTab() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialHospitalId = params.get("hospital");
  const initialCity = params.get("city") || "";

  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { selectedCity } = useCity();
  const { allHospitals, isLoading, updateHospital } = useHospitalStore();

  const [filterCity, setFilterCity] = useState(initialCity || selectedCity || "");
  const [selectedId, setSelectedId] = useState<string>(initialHospitalId || "");

  const hospitals = useMemo(() => {
    if (!filterCity) return allHospitals;
    return allHospitals.filter(
      (h) => h.city.toLowerCase() === filterCity.toLowerCase()
    );
  }, [allHospitals, filterCity]);

  const hospital = useMemo(() => {
    if (!selectedId) return null;
    return allHospitals.find((h) => h.id === selectedId) || null;
  }, [allHospitals, selectedId]);

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      hospitalId: "",
      status: "Available",
      emergencyLevel: null,
      bedsAvailable: 0,
      icuAvailable: 0,
      ventilatorsAvailable: 0,
      bloodUnitsAvailable: "",
      specialties: [],
      contactNumber: "",
    },
  });

  useEffect(() => {
    if (hospital) {
      form.reset({
        hospitalId: hospital.id,
        status: hospital.status as "Available" | "Limited" | "Full",
        emergencyLevel: (hospital.emergencyLevel as any) || null,
        bedsAvailable: hospital.bedsAvailable,
        icuAvailable: hospital.icuAvailable,
        ventilatorsAvailable: hospital.ventilatorsAvailable,
        bloodUnitsAvailable: hospital.bloodUnitsAvailable || "",
        specialties: hospital.specialties || [],
        contactNumber: hospital.contactNumber || "",
      });
    } else if (!selectedId) {
      form.reset({
        hospitalId: "",
        status: "Available",
        emergencyLevel: null,
        bedsAvailable: 0,
        icuAvailable: 0,
        ventilatorsAvailable: 0,
        bloodUnitsAvailable: "",
        specialties: [],
        contactNumber: "",
      });
    }
  }, [hospital, selectedId, form]);

  const onSubmit = (values: UpdateFormValues) => {
    if (!values.hospitalId) return;
    const { hospitalId, ...updateData } = values;
    updateHospital(hospitalId, {
      ...updateData,
      bloodUnitsAvailable: updateData.bloodUnitsAvailable || null,
    });
    toast({
      title: "Update Successful",
      description: "Hospital availability has been saved and will persist in this browser.",
    });
    setLocation("/dashboard");
  };

  return (
    <Card className="border-primary/20 shadow-md">
      <CardHeader className="bg-muted/30 border-b">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Facility Status Update
        </CardTitle>
        <CardDescription>Changes made here instantly reflect on the live dashboard and AI routing algorithms.</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="pt-6 space-y-8">
            {/* City Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by City</label>
              <Select value={filterCity || "all"} onValueChange={(v) => {
                setFilterCity(v === "all" ? "" : v);
                setSelectedId("");
                form.setValue("hospitalId", "");
              }}>
                <SelectTrigger className="bg-background w-[200px]">
                  <SelectValue placeholder="All cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All cities</SelectItem>
                  {CITY_LIST.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Hospital */}
            <FormField
              control={form.control}
              name="hospitalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Facility</FormLabel>
                  <Select
                    disabled={isLoading}
                    value={field.value}
                    onValueChange={(val) => { field.onChange(val); setSelectedId(val); }}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={isLoading ? "Loading..." : "Select a hospital to update"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hospitals.map((h) => (
                        <SelectItem key={h.id} value={h.id}>
                          {h.name} — {h.area}
                          {!filterCity && ` (${h.city})`}
                        </SelectItem>
                      ))}
                      {hospitals.length === 0 && (
                        <SelectItem value="none" disabled>No hospitals for selected city</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedId && hospital && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/20 rounded-xl border">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overall Status</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Available">Available (Accepting)</SelectItem>
                            <SelectItem value="Limited">Limited (Partial Divert)</SelectItem>
                            <SelectItem value="Full">Full (Total Divert)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Level</FormLabel>
                        <Select value={field.value || "none"} onValueChange={(v) => field.onChange(v === "none" ? null : v)}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Normal / No Emergency</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-4">Resource Capacity</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(["bedsAvailable", "icuAvailable", "ventilatorsAvailable"] as const).map((field) => (
                      <FormField
                        key={field}
                        control={form.control}
                        name={field}
                        render={({ field: f }) => (
                          <FormItem>
                            <FormLabel>{field === "bedsAvailable" ? "General Beds" : field === "icuAvailable" ? "ICU Beds" : "Ventilators"}</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...f} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="bloodUnitsAvailable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Supply</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. A+, O- critical, B+ adequate" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormDescription>Comma-separated or notes.</FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact</FormLabel>
                        <FormControl>
                          <Input placeholder="+91..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-4">Active Specialties</h3>
                  <FormField
                    control={form.control}
                    name="specialties"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {ALL_SPECIALTIES.map((item) => (
                            <FormField
                              key={item}
                              control={form.control}
                              name="specialties"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-3 bg-background">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) =>
                                        checked
                                          ? field.onChange([...(field.value || []), item])
                                          : field.onChange(field.value?.filter((v) => v !== item))
                                      }
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-xs cursor-pointer">{item}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t bg-muted/10 p-6 flex justify-between items-center">
            <p className="text-sm text-muted-foreground flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Double-check values before broadcasting.
            </p>
            <Button type="submit" size="lg" disabled={!selectedId}>
              <Save className="mr-2 h-4 w-4" /> Broadcast Update
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

// ── Add Hospital Tab ────────────────────────────────────────────────
function AddHospitalTab() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { addHospital } = useHospitalStore();

  const form = useForm<AddFormValues>({
    resolver: zodResolver(addSchema),
    defaultValues: {
      name: "",
      city: "",
      customCity: "",
      state: "",
      area: "",
      status: "Available",
      emergencyLevel: null,
      bedsAvailable: 0,
      icuAvailable: 0,
      ventilatorsAvailable: 0,
      bloodUnitsAvailable: "",
      specialties: [],
      contactNumber: "",
    },
  });

  const watchCity = form.watch("city");

  useEffect(() => {
    if (watchCity && watchCity !== "other") {
      form.setValue("state", CITY_STATE_MAP[watchCity] || "");
    }
  }, [watchCity, form]);

  const onSubmit = (values: AddFormValues) => {
    const city = values.city === "other" ? (values.customCity || "").trim() : values.city;
    if (!city) {
      form.setError("city", { message: "City is required" });
      return;
    }

    addHospital({
      name: values.name,
      city,
      state: values.state,
      area: values.area,
      status: values.status,
      emergencyLevel: values.emergencyLevel,
      bedsAvailable: values.bedsAvailable,
      icuAvailable: values.icuAvailable,
      ventilatorsAvailable: values.ventilatorsAvailable,
      bloodUnitsAvailable: values.bloodUnitsAvailable || null,
      specialties: values.specialties,
      contactNumber: values.contactNumber,
    });

    toast({
      title: "Hospital Added",
      description: `${values.name} has been added to the ${city} dashboard and saved locally.`,
    });
    form.reset();
    setLocation("/dashboard");
  };

  return (
    <Card className="border-green-500/20 shadow-md">
      <CardHeader className="bg-muted/30 border-b">
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-green-500" />
          Add New Hospital
        </CardTitle>
        <CardDescription>Register a new hospital to appear on the city dashboard immediately.</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="pt-6 space-y-6">
            {/* Hospital Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hospital Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Apollo Multispeciality Hospital" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CITY_LIST.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                        <SelectItem value="other">Other (type below)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchCity === "other" && (
                <FormField
                  control={form.control}
                  name="customCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom City Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              {/* State */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Tamil Nadu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Area */}
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area / Locality</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Anna Nagar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Limited">Limited</SelectItem>
                        <SelectItem value="Full">Full</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Level</FormLabel>
                    <Select value={field.value || "none"} onValueChange={(v) => field.onChange(v === "none" ? null : v)}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {(["bedsAvailable", "icuAvailable", "ventilatorsAvailable"] as const).map((f) => (
                <FormField
                  key={f}
                  control={form.control}
                  name={f}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{f === "bedsAvailable" ? "General Beds" : f === "icuAvailable" ? "ICU Beds" : "Ventilators"}</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bloodUnitsAvailable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Availability</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. A+, O+, B-" {...field} value={field.value || ""} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+91..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">Specialties</h3>
              <FormField
                control={form.control}
                name="specialties"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ALL_SPECIALTIES.map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="specialties"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-2.5 bg-background">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) =>
                                    checked
                                      ? field.onChange([...(field.value || []), item])
                                      : field.onChange(field.value?.filter((v) => v !== item))
                                  }
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-xs cursor-pointer">{item}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="border-t bg-muted/10 p-6 flex justify-end gap-3">
            <Button type="submit" size="lg" variant="default" className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" /> Add Hospital
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

// ── Page ─────────────────────────────────────────────────────────────
export default function UpdatePanel() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const defaultTab = params.has("add") ? "add" : "update";
  const { toast } = useToast();
  const { resetToDefaults } = useHospitalStore();

  const handleReset = async () => {
    await resetToDefaults();
    toast({
      title: "Demo Data Restored",
      description: "All hospitals have been reset to the original 25 sample hospitals.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Hospital Update Panel</h1>
        <p className="text-muted-foreground mt-1">Staff portal for updating facility capacity or adding new hospitals to the network.</p>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="update" className="flex-1">Update Existing Hospital</TabsTrigger>
          <TabsTrigger value="add" className="flex-1">Add New Hospital</TabsTrigger>
        </TabsList>
        <TabsContent value="update">
          <UpdateTab />
        </TabsContent>
        <TabsContent value="add">
          <AddHospitalTab />
        </TabsContent>
      </Tabs>

      {/* ── Storage Note + Reset ──────────────────────────────── */}
      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-dashed bg-muted/30">
        <p className="text-sm text-muted-foreground">
          Added hospitals are saved locally in this browser for demo purposes.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleReset}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Demo Data
        </Button>
      </div>
    </div>
  );
}
