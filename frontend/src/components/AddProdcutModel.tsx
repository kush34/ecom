import { useEffect, useState } from "react"
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
import type { ProductType } from "@/store/CartContext"

type Props = {
    onSuccess: () => void
    product?: ProductType | null
    onClose?: () => void
}

const AddProductModal = ({ product, onSuccess, onClose }: Props) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        productName: "",
        price: "",
        description: "",
        images: [] as string[],
        quantity: "",
    })

    const [imageInput, setImageInput] = useState("") // temp input
    const addImage = () => {
        const url = imageInput.trim()
        if (!url) return

        setForm(prev => ({
            ...prev,
            images: [...prev.images, url],
        }))
        setImageInput("")
    }

    const removeImage = (index: number) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }))
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSubmit = async () => {
        const payload = {
            productName: form.productName,
            description: form.description,
            price: Number(form.price),
            images: form.images,
            quantity: Number(form.quantity),
        }

        setLoading(true)
        try {
            if (product?._id) {
                // UPDATE
                await axiosInstace.put(`/product/updateProduct/${product._id}`, payload)
            } else {
                // CREATE
                await axiosInstace.post("/product/createProduct", payload)
            }

            onSuccess()
            setOpen(false)
            onClose?.()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (product) {
            setForm({
                productName: product.productName,
                price: String(product.price),
                description: product.description,
                images: product.images || [],
                quantity: String(product.quantity ?? ""),
            })
            setOpen(true)
        }
    }, [product])
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="text-white"><Plus /> Product</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md bg-background">
                <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-2">
                    {form.images.map((img, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={img}
                                className="w-full h-24 object-cover rounded"
                                alt="preview"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-black text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
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
                    <div className="flex gap-2">
                        <Input
                            placeholder="Image URL"
                            value={imageInput}
                            onChange={(e) => setImageInput(e.target.value)}
                        />
                        <Button type="button" onClick={addImage}>
                            Add
                        </Button>
                    </div>
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