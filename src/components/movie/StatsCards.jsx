
export function StatsCards({ stats }) {
    return (
        <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                <p className="text-sm text-gray-600 mb-1">Total Movies</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalMovies}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
                <p className="text-sm text-gray-600 mb-1">Recent (5 years)</p>
                <p className="text-3xl font-bold text-gray-900">{stats.recentMovies}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
                <p className="text-sm text-gray-600 mb-1">High Rated (7+)</p>
                <p className="text-3xl font-bold text-gray-900">{stats.highRated}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                <p className="text-sm text-gray-600 mb-1">Total Genres</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalGenres}</p>
            </div>
        </div>
    );
}