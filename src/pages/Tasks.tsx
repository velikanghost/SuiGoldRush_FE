const Tasks = () => {
  return (
    <div className="relative h-full w-[93%] rounded mx-auto bg-[#0a3d00]/50 border border-[#8cc63f] p-4">
      <div className="pb-4 border-b border-[#ffd700]">
        <h1 className="pb-2 text-3xl font-bold text-[#ffd700] font-body">
          Complete Tasks!
        </h1>
        <p className="font-semibold text-[#e0d6b9]">Earn more gold coins.</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 mt-4">
        <div className="bg-[#F5EAD1] w-full flex justify-between p-2 rounded items-center">
          <p className="text-[#5C4F3A] font-medium">Follow Sui Goldrush on X</p>
          <button className="bg-[#3E8E41] text-[#F0E5D6] py-1 px-3 rounded">
            Go
          </button>
        </div>
        <div className="bg-[#F5EAD1] w-full flex justify-between p-2 rounded items-center">
          <p className="text-[#5C4F3A] font-medium">Follow Kaze on X</p>
          <button className="bg-[#3E8E41] text-[#F0E5D6] py-1 px-3 rounded">
            Go
          </button>
        </div>
        <div className="bg-[#F5EAD1] w-full flex justify-between p-2 rounded items-center">
          <p className="text-[#5C4F3A] font-medium">
            Subscribe to Sui Golrush Telegram
          </p>
          <button className="bg-[#3E8E41] text-[#F0E5D6] py-1 px-3 rounded">
            Go
          </button>
        </div>
      </div>
    </div>
  )
}

export default Tasks
