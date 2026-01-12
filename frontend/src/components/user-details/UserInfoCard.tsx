import { CardTitle } from "@/components/ui/card"
import { CircleUser, Mail } from "lucide-react"

export const UserInfoCard = ({ userId, email }: { userId: string; email: string }) => (
  <CardTitle className="p-6 pb-4 border-b border-gray-100">
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-gray-700">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <CircleUser className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-normal">User ID</p>
          <p className="text-sm font-medium text-gray-900">{userId}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-700 text-sm">
        <Mail className="w-4 h-4 text-gray-500" />
        <span>{email}</span>
      </div>
    </div>
  </CardTitle>
)