import { useEffect, useState } from 'react';
import { FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Item = {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  rating: {
    rate: number;
    count: number;
  };
  category: string;
};

type State = {
  items: Item[];
  loading: boolean;
  error: string | null;
};

export default function Explore() {
  const [data, setData] = useState<State>({
    items: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    setData(prev => ({ ...prev, loading: true }));

    const fetchData = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setData(prev => ({
          ...prev,
          items: data,
          loading: false,
        }));
      } catch (error) {
        setData(prev => ({ ...prev, loading: false, error: error as string }));
      }
    };

    fetchData();
  }, []);

  if (data.loading) {
    return <Text>Loading...</Text>;
  }

  if (data.error) {
    return <Text>Error: {data.error}</Text>;
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1">
      <Text className="text-xl font-bold text-center">
        Items: {data.items.length}
      </Text>
      <FlatList
        data={data.items}
        renderItem={({ item }) => (
          <Text className="text-md py-2">{item.title}</Text>
        )}
        initialNumToRender={10}
        keyExtractor={item => item.id.toString()}
        className="m-2"
      />
    </SafeAreaView>
  );
}
