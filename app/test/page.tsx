import game_modes from '../game_modes.json'

function get_game_modes() {
    console.log(game_modes)
    const options = []
    for (var mode in game_modes) {
        console.log(mode)
        options.push(<option key={mode} value={mode}>{mode}</option>)
    }
    return options
}

export default function Test() {
    get_game_modes()
    return (
        <div className="w-full max-w-xs">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Número de preguntes
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="num_preg"
                        type="number"
                        min="1"
                        max="20"
                        step="1"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Mode de joc
                    </label>
                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        {get_game_modes()}
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" >
                        Comença!
                    </button>
                </div>
            </form>
        </div>
    );
}