import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { UserContext, type address } from "@/store/UserContext"
import { useContext, useState } from "react"
import { columns } from "@/components/Address-table/columnDef"
import { BookUser, CircleUser, Mail, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"

const UserDetails = () => {
  const userCtx = useContext(UserContext)
  const user = userCtx?.user

  const [selectedAddresses, setSelectedAddresses] = useState<address[]>([])
  console.log("len", selectedAddresses.length)
  const canDelete = selectedAddresses.length > 0
  const canUpdate = selectedAddresses.length === 1

  const handleDelete = () => {
    console.log("Delete:", selectedAddresses)
  }

  const handleUpdate = () => {
    console.log("Update:", selectedAddresses[0])
  }
  console.log(canDelete,canUpdate)
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-white border border-gray-200 shadow-sm mb-6">
          <CardTitle className="p-6 pb-4 border-b border-gray-100">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <CircleUser className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-normal">User ID</p>
                  <p className="text-sm font-medium text-gray-900">{user?._id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{user?.email}</span>
              </div>
            </div>
          </CardTitle>
          
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <BookUser className="w-5 h-5 text-gray-700" />
              <span className="text-lg font-semibold text-gray-900">Addresses</span>
              {user?.addresses && (
                <span className="ml-auto text-sm text-gray-500">
                  {user.addresses.length} saved
                </span>
              )}
            </div>
            
            {user?.addresses && user?.addresses?.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <DataTable
                  columns={columns}
                  data={user.addresses}
                  onSelectionChange={setSelectedAddresses}
                />
              </div>
            )}
            
            {selectedAddresses.length > 0 && (
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                {canUpdate && (
                  <Button 
                    variant="outline" 
                    onClick={handleUpdate}
                    className="flex-1 border-gray-900 text-gray-900 hover:bg-gray-50 font-medium"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Address
                  </Button>
                )}
                <Button 
                  variant="default" 
                  onClick={handleDelete}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete {selectedAddresses.length > 1 ? `(${selectedAddresses.length})` : ''}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UserDetails
