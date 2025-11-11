const InputWithIcon = ({ Icon, ...props }: any) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      {...props}
      className="w-full border border-gray-300 p-2.5 pl-9 text-sm rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
    />
  </div>
);
export default InputWithIcon;
