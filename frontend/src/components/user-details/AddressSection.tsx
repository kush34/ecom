import { DataTable } from "@/components/data-table"
import { BookUser, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { columns } from "@/components/Address-table/columnDef"
import type { address } from "@/store/UserContext"

interface AddressSectionProps {
  addresses: address[]
  selectedAddresses: address[]
  onSelectionChange: (addresses: address[]) => void
  onUpdate: () => void
  onDelete: () => void
}

export const AddressSection = ({
  addresses,
  selectedAddresses,
  onSelectionChange,
  onUpdate,
  onDelete
}: AddressSectionProps) => {
  const canDelete = selectedAddresses.length > 0
  const canUpdate = selectedAddresses.length === 1

  return (
    <>
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
        <BookUser className="w-5 h-5 text-gray-700" />
        <span className="text-lg font-semibold text-gray-900">Addresses</span>
        <span className="ml-auto text-sm text-gray-500">{addresses.length} saved</span>
      </div>

      {addresses.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <DataTable
            columns={columns}
            data={addresses}
            onSelectionChange={onSelectionChange}
          />
        </div>
      )}

      {canDelete && (
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
          {canUpdate && (
            <Button
              variant="outline"
              onClick={onUpdate}
              className="flex-1 border-gray-900 text-gray-900 hover:bg-gray-50 font-medium"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Update Address
            </Button>
          )}
          <Button
            variant="default"
            onClick={onDelete}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete {selectedAddresses.length > 1 ? `(${selectedAddresses.length})` : ''}
          </Button>
        </div>
      )}
    </>
  )
}