import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Colors } from '../styles/theme';

type tabStyle = 'default' | 'buttons' | 'inverted';

interface Tab {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface TabsComponentProps {
  tabs: Tab[];
  tabStyle?: tabStyle;
}

const Tabs: React.FC<TabsComponentProps> = ({ tabs, tabStyle = 'buttons' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleTabPress = (index: number) => {
    setActiveIndex(index);
    pagerRef.current?.setPage(index);

    // Scroll para hacer visible la pestaña seleccionada
    scrollViewRef.current?.scrollTo({
      x: index * 100, // Ajusta este valor según el ancho de tus pestañas
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      {/* ScrollView para las pestañas */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.tabsContainer,
          tabStyle === 'inverted' && {
            backgroundColor: Colors.primary,
            paddingBottom: 0,
          },
          tabStyle === 'default' && { paddingBottom: 0 },
        ]}
      >
        {tabs.map((tab, index) => (
          <Pressable
            key={tab.id}
            onPress={() => handleTabPress(index)}
            style={[
              styles.tabButton,
              activeIndex === index && styles.activeTab,
              tabStyle === 'default' &&
                activeIndex === index && {
                  borderBottomWidth: 2,
                  borderRadius: 0,
                  backgroundColor: '',
                },
              tabStyle === 'inverted' &&
                activeIndex === index && {
                  borderBottomWidth: 2,
                  borderRadius: 0,
                  borderColor: Colors.semanticSuccess,
                },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeIndex === index && styles.activeTabText,
                tabStyle === 'default' && { color: Colors.textMain },
                tabStyle === 'inverted' && { color: Colors.textWhite },
              ]}
            >
              {tab.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* ViewPager para el contenido */}
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)}
      >
        {tabs.map((tab) => (
          <View key={tab.id} style={styles.page}>
            {tab.content}
          </View>
        ))}
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    height: '30%',
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.textWhite,
  },
  activeTabText: {
    color: Colors.textWhite,
    fontWeight: 'bold',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    padding: 20,
  },
});

export default Tabs;
