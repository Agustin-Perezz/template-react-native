import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

type Item = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  subCategory: string;
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
    <View>
      <Text>Items: {data.items.length}</Text>
      <FlatList
        data={data.items}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        initialNumToRender={10}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
