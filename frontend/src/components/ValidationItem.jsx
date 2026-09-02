
function ValidationItem({ valid, text }) {

  return (
    <div className="flex items-center gap-3 mb-3">
      <div
        className={`w-5 h-5 rounded-full border-2 ${
          valid ? "bg-green-500 border-green-500" : "border-gray-300"
        }`}
      ></div>

      <p className={`text-sm ${valid ? "text-green-600" : "text-gray-500"}`}>
        {text}
      </p>
    </div>
  );
}

export default ValidationItem;