import ProtectedRoute from '@/components/protected-route';
import Training from '@/components/training';

export default function TrainingPage() {
  return (
    <ProtectedRoute>
      <Training />
    </ProtectedRoute>
  );
}
