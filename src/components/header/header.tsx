
export const HeaderTemplate = () => {
    return (
        <div className="w-full px-5 pt-10 pb-5 flex flex-col">
            <div>
                <h2 className="text-blue-500 font-extrabold text-xl">Bom dia 👋</h2>
            </div>
            <div className="w-full flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-blue-950">Car Center Sumaré</h1>
                <img className="w-14 h-14" src="/default-avatar.png" alt="avatar" />
            </div>
        </div>
    )
}