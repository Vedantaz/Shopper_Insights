interface ProfileCardProps {
  name: string;
  email: string;
}

export default function ProfileCard({ name, email }: ProfileCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-6">
      <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold text-white">
        {name[0]}
      </div>
      <div>
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-gray-600">{email}</p>
      </div>
    </div>
  );
}
