import { useRef } from 'react';
import { Animated } from 'react-native';
import { useDispatch } from 'react-redux';
import { setTabBarVisibility, setSearchBarVisibility } from '../redux/slices/visibilitySlice';

const onScrollHideElement = () => {
  const dispatch = useDispatch();
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const isScrollingDown = currentOffset > lastScrollY.current;

    if (isScrollingDown && currentOffset > 50) {
      dispatch(setTabBarVisibility(false));
      dispatch(setSearchBarVisibility(false));
    } else {
      dispatch(setTabBarVisibility(true));
      dispatch(setSearchBarVisibility(true));
    }

    lastScrollY.current = currentOffset;
  };

  // Wrap your handleScroll in an Animated.event with useNativeDriver
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: handleScroll, // Use the handleScroll function as the listener
    }
  );

  return { onScroll }; // Return the wrapped event
};

export default onScrollHideElement;
