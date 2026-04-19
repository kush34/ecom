import { useState } from "react"
import { axiosInstace } from "@/utils/axiosService"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

type Props = {
    onSuccess: () => void
}

const AddProductModal = ({ onSuccess }: Props) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        productName: "",
        price: "",
        description: "",
        images: "",
        quantity: "",
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSubmit = async () => {
        if (!form.productName || !form.price) return

        setLoading(true)
        try {
            await axiosInstace.post("/product/createProduct", {
                ...form,
                price: Number(form.price),
                quantity: Number(form.quantity)
            })

            setOpen(false)
            setForm({ productName: "", price: "", description: "", images: "", quantity: "" })
            onSuccess() // refetch inventory
        } catch (err) {
            console.error("Create product failed", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="text-white"><Plus/> Product</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md bg-background">
                <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-2">
                    <Input
                        name="productName"
                        placeholder="Product Name"
                        value={form.productName}
                        onChange={handleChange}
                    />

                    <Input
                        name="price"
                        type="number"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                    />

                    <Input
                        name="quantity"
                        type="number"
                        placeholder="Quantity"
                        value={form.quantity}
                        onChange={handleChange}
                    />

                    <Input
                        name="images"
                        placeholder="Image URL"
                        value={form.images}
                        onChange={handleChange}
                    />

                    <Textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                    />

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="text-white"
                    >
                        {loading ? "Adding..." : "Add Product"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddProductModal