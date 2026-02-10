import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function MovieDialog({
  open,
  onOpenChange,
  movie,
  onSubmit,
  isSubmitting,
  title
}) {
  const [formData, setFormData] = useState(() => {
    if (movie) {
      return {
        title: movie.title || '',
        plot: movie.plot || '',
        year: movie.year || '',
        runtime: movie.runtime || '',
        genres: movie.genres?.join(', ') || '',
        directors: movie.directors?.join(', ') || '',
        cast: movie.cast?.join(', ') || '',
        rating: movie.imdb?.rating || '',
      };
    }
    return {
      title: '',
      year: '',
      rating: '',
      plot: '',
      genres: '',
      directors: '',
      cast: '',
      runtime: ''
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('Please enter a title');
      return;
    }

    const movieData = {
      title: formData.title.trim(),
      plot: formData.plot.trim(),
      fullplot: formData.plot.trim(), 
      genres: formData.genres.split(',').map(g => g.trim()).filter(Boolean),
      runtime: parseInt(formData.runtime) || 0,
      cast: formData.cast.split(',').map(c => c.trim()).filter(Boolean),
      directors: formData.directors.split(',').map(d => d.trim()).filter(Boolean),
      year: parseInt(formData.year) || new Date().getFullYear(),
      released: new Date().toISOString(), 
      languages: ['English'], 
      rated: 'PG-13',
      poster: '',
      countries: ['USA'],
      type: 'movie', 
      awards: {
        wins: 0,
        nominations: 0,
        text: ''
      },
      imdb: {
        rating: parseFloat(formData.rating) || 0,
        votes: 0, // Required by API
        id: 0 // Required by API
      },
      tomatoes: { // Required by API
        viewer: {
          rating: 0,
          numReviews: 0,
          meter: 0
        },
        critic: {
          rating: 0,
          numReviews: 0,
          meter: 0
        },
        fresh: 0,
        rotten: 0,
        lastUpdated: new Date().toISOString()
      }
    };

    onSubmit(movieData);

    // Clear form for add mode only
    if (!movie) {
      setFormData({
        title: '',
        year: '',
        rating: '',
        plot: '',
        genres: '',
        directors: '',
        cast: '',
        runtime: ''
      });
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                name="title"
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="The Shawshank Redemption"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Plot *</label>
              <textarea
                name="plot"
                required
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
                placeholder="Enter movie plot..."
                value={formData.plot}
                onChange={(e) => setFormData({ ...formData, plot: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Year *</label>
                <input
                  name="year"
                  type="number"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="1994"
                  min="1900"
                  max="2100"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Runtime (minutes) *</label>
                <input
                  name="runtime"
                  type="number"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="142"
                  min="1"
                  value={formData.runtime}
                  onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Genres (comma-separated) *</label>
              <input
                name="genres"
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Drama, Crime"
                value={formData.genres}
                onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Directors (comma-separated) *</label>
              <input
                name="directors"
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Frank Darabont"
                value={formData.directors}
                onChange={(e) => setFormData({ ...formData, directors: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cast (comma-separated) *</label>
              <input
                name="cast"
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Tim Robbins, Morgan Freeman"
                value={formData.cast}
                onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">IMDb Rating</label>
              <input
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="10"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="9.3"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : movie ? 'Save Changes' : 'Add Movie'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}