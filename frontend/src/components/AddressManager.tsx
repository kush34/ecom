import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { axiosInstace } from "@/utils/axiosService";
import { toast } from "sonner";
import type { address } from "@/store/UserContext";

export function AddressManager({ address }: { address: address | null }) {
    const [formData, setFormData] = useState(
        address || { address: "", city: "", pincode: "", contact: "" }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validateData = () => {
        const { address, city, pincode, contact } = formData;

        if (!address.trim() || !city.trim()) {
            toast.error("Address and City are required");
            return false;
        }

        if (!/^\d{6}$/.test(pincode)) {
            toast.error("Enter a valid 6-digit pincode");
            return false;
        }

        if (!/^\+?[0-9]{10,13}$/.test(contact)) {
            toast.error("Enter a valid contact number (10–13 digits)");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateData()) return;

        const payload = {
            address: {
                ...formData,
                pincode: Number(formData.pincode),
            },
        };

        if (isNaN(payload.address.pincode)) {
            toast.error("Invalid pincode");
            return;
        }
        try {
            const res = await axiosInstace.post("/user/addAddress", payload);

            if (res.status === 200) {
                toast.success("Address Saved");
            }
        } catch (error: any) {
            if (error.response) {
                const message = error.response.data?.error || "Save failed";
                toast.error(message);
            } else if (error.request) {
                toast.error("Server not responding");
            } else {
                toast.error("Unexpected error");
            }
            console.error("Failed to save address", error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <span className="flex cursor-pointer items-center gap-1 text-sm">
                    <MapPin strokeWidth={1.5} size={16} />{" "}
                    {address
                        ? `${address.address}, ${address.city}`
                        : "Click here to add address"}
                </span>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] bg-white">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Manage Address</DialogTitle>
                        <DialogDescription>
                            Enter your delivery details and click save.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="e.g. 16, Sai Society"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="e.g. Bangalore"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="pincode">Pincode</Label>
                            <Input
                                id="pincode"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="560001"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="contact">Contact Number</Label>
                            <Input
                                id="contact"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                placeholder="+91 9876543210"
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
