import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/seperator';
import { 
  Mic, 
  Search, 
  Plus, 
  LogOut, 
  User, 
  Clock,
  Sparkles,
  Edit,
  Trash2,
  Volume2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/axiosConfig';
import { toast } from 'sonner';
import VoiceRecorder from '../components/VoiceRecorder';
import NoteCard from '../components/NoteCard';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecorder, setShowRecorder] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notes', {
        params: searchTerm ? { search: searchTerm } : {}
      });
      setNotes(response.data);
    } catch (error) {
      toast.error('Failed to fetch notes');
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchNotes();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleNoteCreated = (newNote) => {
    setNotes(prevNotes => [newNote, ...prevNotes]);
    setShowRecorder(false);
    toast.success('Note created successfully!');
  };

  const handleNoteUpdated = (updatedNote) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      )
    );
  };

  const handleNoteDeleted = (noteId) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Voice Notes AI
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowRecorder(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Note</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <Card className="glass-container border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search your notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 input-field"
                  />
                </div>
                <Button onClick={handleSearch} className="btn-primary">
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card hover:shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Notes</p>
                  <p className="text-3xl font-bold text-indigo-600">{notes.length}</p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <Volume2 className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card hover:shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Summarized</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {notes.filter(note => note.summary).length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card hover:shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Recent Activity</p>
                  <p className="text-3xl font-bold text-cyan-600">
                    {notes.length > 0 ? formatDate(notes[0]?.created_at).split(',')[0] : 'None'}
                  </p>
                </div>
                <div className="p-3 bg-cyan-100 rounded-full">
                  <Clock className="h-6 w-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="loading-spinner"></div>
            <span className="ml-3 text-gray-600">Loading your notes...</span>
          </div>
        ) : notes.length === 0 ? (
          <Card className="glass-container border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full">
                  <Mic className="h-12 w-12 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                No notes yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? `No notes found matching "${searchTerm}". Try a different search term.`
                  : "Start creating your first voice note! Click 'New Note' to begin recording."
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setShowRecorder(true)}
                  className="btn-primary flex items-center space-x-2 mx-auto"
                >
                  <Mic className="h-4 w-4" />
                  <span>Create First Note</span>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note, index) => (
              <div key={note.id} className="scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <NoteCard
                  note={note}
                  onUpdate={handleNoteUpdated}
                  onDelete={handleNoteDeleted}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Voice Recorder Modal */}
      {showRecorder && (
        <VoiceRecorder
          onNoteCreated={handleNoteCreated}
          onClose={() => setShowRecorder(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;