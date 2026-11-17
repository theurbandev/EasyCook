import { router } from 'expo-router';
import { MealForm } from '@/components/MealForm';
import { useStore } from '@/lib/store';

export default function NewMealScreen() {
  const store = useStore();
  return (
    <MealForm
      submitLabel="Save to favorites"
      initial={{ name: '', cuisine: '', notes: '', kidFriendly: store.settings.hasKids, stars: 5 }}
      onSubmit={({ stars, ...meal }) => {
        store.saveMeal(meal);
        if (stars) store.rate(meal.name, meal.cuisine, stars);
        router.back();
      }}
    />
  );
}
