import { Plus, Download, Edit2, Trash2, Clock, FileText, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  loadMovies,
  addMovie,
  editMovie,
  removeMovie,
  toggleMovieSelection,
  setSelectedMovies,
  setMovieCurrentPage,
  selectMoviesLoading,
  selectMoviesError,
  selectSelectedMovies,
  selectMovieCurrentPage,
  clearMovieSelection,
} from "../store/slices/managementSlice";
import { Pagination } from "@/components/Pagination";
import { MovieDialog } from "@/components/movie/movieDialog";
import { StateView } from "@/components/StateView";
import { StatsCards } from "@/components/movie/StatsCards";

export default function Management() {
  const dispatch = useDispatch();

  const allMovies = useSelector((state) => state.management.movies);
  const loading = useSelector(selectMoviesLoading);
  const error = useSelector(selectMoviesError);
  const selected = useSelector(selectSelectedMovies);
  const currentPage = useSelector(selectMovieCurrentPage);

  const [editingMovie, setEditingMovie] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    dispatch(loadMovies());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(loadMovies());
  };

  const getFilteredMovies = () => {
    const currentYear = new Date().getFullYear();
    switch (activeTab) {
      case "Recent":
        return allMovies.filter((m) => m.year >= currentYear - 5);
      case "High Rated":
        return allMovies.filter((m) => m.imdb?.rating >= 7);
      case "Classics":
        return allMovies.filter((m) => m.year < 2000);
      case "Action":
        return allMovies.filter((m) =>
          m.genres?.some(g => g.toLowerCase().includes("action"))
        );
      case "All":
      default:
        return allMovies;
    }
  };

  const filteredMovies = getFilteredMovies();
  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / pageSize));
  const currentMovies = filteredMovies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const stats = {
    totalMovies: allMovies.length,
    recentMovies: allMovies.filter((m) => m.year >= new Date().getFullYear() - 5).length,
    highRated: allMovies.filter((m) => m.imdb?.rating >= 7).length,
    totalGenres: new Set(allMovies.flatMap((m) => m.genres || [])).size,
  };

  const toggle = (id) => {
    dispatch(toggleMovieSelection(id));
  };

  const allSelected = selected.length === currentMovies.length && currentMovies.length > 0;

  const handleSelectAll = () => {
    if (allSelected) {
      dispatch(clearMovieSelection());
    } else {
      dispatch(setSelectedMovies(currentMovies.map((m) => m._id)));
    }
  };

  const handlePageChange = (page) => {
    dispatch(setMovieCurrentPage(page));
  };

  const handleAddMovie = async (movieData) => {
    setIsSubmitting(true);
    try {
      await dispatch(addMovie(movieData)).unwrap();
      setIsAddDialogOpen(false);
    } catch (error) {
      alert(`Failed to add movie: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setIsEditDialogOpen(true);
  };

  const handleUpdateMovie = async (movieData) => {
    setIsSubmitting(true);
    try {
      await dispatch(editMovie({ id: editingMovie._id, data: movieData })).unwrap();
      setIsEditDialogOpen(false);
      setEditingMovie(null);
    } catch (error) {
      alert(`Failed to update movie: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    setIsDeleting(true);
    try {
      await dispatch(removeMovie(movieId)).unwrap();
    } catch (error) {
      alert(`Failed to delete movie: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      for (const id of selected) {
        await dispatch(removeMovie(id)).unwrap();
      }
      dispatch(clearMovieSelection());
    } catch (error) {
      alert(`Failed to delete some movies: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <StateView
      loading={loading}
      error={error}
      isEmpty={allMovies.length === 0}
      onRetry={handleRetry}
      loadingText="Loading movies..."
      errorTitle="Error Loading Movies"
      emptyTitle="No Movies Found"
      emptyMessage="Try adding some movies or check your connection."
      showRetry={true}
      retryText="Retry"
    >
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Movie Management</h1>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Bulk Actions
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Movies
            </button>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Movie
                </button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        <StatsCards stats={stats} />

        <div className="mb-6 flex gap-1 border-b">
          {["All", "Recent", "High Rated", "Classics", "Action"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                dispatch(setMovieCurrentPage(1));
              }}
              className={`px-4 py-2 font-medium ${activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded"
                    disabled={isDeleting}
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Year
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Genre
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Director
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Runtime
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {currentMovies.map((movie) => {
                const isSel = selected.includes(movie._id);
                return (
                  <tr
                    key={movie._id}
                    className={`hover:bg-gray-50 ${isSel ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() => toggle(movie._id)}
                        className="w-4 h-4 rounded"
                        disabled={isDeleting}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{movie.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{movie.plot}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{movie.year}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {movie.genres?.slice(0, 2).map((genre, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {movie.directors?.[0] || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-gray-900">
                          {movie.imdb?.rating?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {movie.runtime ? `${movie.runtime} min` : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditMovie(movie)}
                          className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                          disabled={isDeleting}
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                              disabled={isDeleting}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Movie</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{movie.title}"?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteMovie(movie._id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={isDeleting}
                              >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <MovieDialog
          key="add-movie"
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={handleAddMovie}
          isSubmitting={isSubmitting}
          title="Add New Movie"
        />

        <MovieDialog
          key={editingMovie?._id || 'edit-movie'}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          movie={editingMovie}
          onSubmit={handleUpdateMovie}
          isSubmitting={isSubmitting}
          title="Edit Movie"
        />

        {selected.length > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4">
            <span className="font-medium">{selected.length} Selected</span>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">
                <FileText className="w-4 h-4 inline mr-2" />
                Duplicate
              </button>
              <button className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">
                <Download className="w-4 h-4 inline mr-2" />
                Export
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 inline mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
            <button
              onClick={() => dispatch(clearMovieSelection())}
              className="ml-4 text-gray-400 hover:text-white"
              disabled={isDeleting}
            >
              ✕
            </button>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredMovies.length}
          pageSize={pageSize}
        />
      </div>
    </StateView>
  );
}