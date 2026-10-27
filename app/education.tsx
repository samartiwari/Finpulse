import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  BookOpen,
  Play,
  Clock,
  Star,
  Award,
  TrendingUp,
  BarChart3,
  Shield,
  Target,
  Zap,
  CheckCircle,
} from 'lucide-react-native';
import colors from '@/constants/colors';

interface Course {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: number;
  rating: number;
  enrolled: number;
  image: string;
  progress?: number;
  completed?: boolean;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  image: string;
  author: string;
}

export default function EducationScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'courses' | 'articles' | 'progress'>('courses');

  const courses: Course[] = [
    {
      id: '1',
      title: 'Stock Market Fundamentals',
      description: 'Learn the basics of stock market investing, from understanding stocks to building your first portfolio.',
      level: 'Beginner',
      duration: '4 hours',
      lessons: 12,
      rating: 4.8,
      enrolled: 15420,
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop',
      progress: 75,
    },
    {
      id: '2',
      title: 'Technical Analysis Mastery',
      description: 'Master chart patterns, indicators, and technical analysis techniques used by professional traders.',
      level: 'Intermediate',
      duration: '6 hours',
      lessons: 18,
      rating: 4.9,
      enrolled: 8930,
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=300&h=200&fit=crop',
      progress: 30,
    },
    {
      id: '3',
      title: 'Options Trading Strategies',
      description: 'Advanced options strategies for income generation and portfolio protection.',
      level: 'Advanced',
      duration: '8 hours',
      lessons: 24,
      rating: 4.7,
      enrolled: 5240,
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop',
    },
    {
      id: '4',
      title: 'Risk Management Essentials',
      description: 'Learn how to protect your capital and manage risk in volatile markets.',
      level: 'Intermediate',
      duration: '3 hours',
      lessons: 10,
      rating: 4.6,
      enrolled: 12100,
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop',
      completed: true,
    },
  ];

  const articles: Article[] = [
    {
      id: '1',
      title: '10 Common Investing Mistakes to Avoid',
      excerpt: 'Learn about the most common pitfalls that new investors face and how to avoid them.',
      readTime: '5 min read',
      category: 'Investing Tips',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=200&fit=crop',
      author: 'Sarah Johnson',
    },
    {
      id: '2',
      title: 'Understanding Market Volatility',
      excerpt: 'Market volatility can be scary, but understanding it can help you make better investment decisions.',
      readTime: '7 min read',
      category: 'Market Analysis',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop',
      author: 'Mike Chen',
    },
    {
      id: '3',
      title: 'Building a Diversified Portfolio',
      excerpt: 'Diversification is key to long-term investment success. Learn how to build a balanced portfolio.',
      readTime: '6 min read',
      category: 'Portfolio Management',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
      author: 'Emma Davis',
    },
  ];

  const achievements = [
    { title: 'First Course Completed', description: 'Complete your first course', earned: true },
    { title: 'Knowledge Seeker', description: 'Read 10 articles', earned: true },
    { title: 'Dedicated Learner', description: 'Study for 7 consecutive days', earned: false },
    { title: 'Expert Level', description: 'Complete an advanced course', earned: false },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return colors.green;
      case 'Intermediate':
        return colors.orange;
      case 'Advanced':
        return colors.red;
      default:
        return colors.primary;
    }
  };

  const renderCourses = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Featured Courses</Text>
      {courses.map((course) => (
        <TouchableOpacity key={course.id} style={styles.courseCard}>
          <Image source={{ uri: course.image }} style={styles.courseImage} />
          <View style={styles.courseContent}>
            <View style={styles.courseHeader}>
              <View style={[styles.levelBadge, { backgroundColor: getLevelColor(course.level) + '20' }]}>
                <Text style={[styles.levelText, { color: getLevelColor(course.level) }]}>
                  {course.level}
                </Text>
              </View>
              {course.completed && (
                <View style={styles.completedBadge}>
                  <CheckCircle size={16} color={colors.green} />
                  <Text style={styles.completedText}>Completed</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseDescription}>{course.description}</Text>
            
            <View style={styles.courseStats}>
              <View style={styles.statItem}>
                <Clock size={14} color={colors.secondaryText} />
                <Text style={styles.statText}>{course.duration}</Text>
              </View>
              <View style={styles.statItem}>
                <BookOpen size={14} color={colors.secondaryText} />
                <Text style={styles.statText}>{course.lessons} lessons</Text>
              </View>
              <View style={styles.statItem}>
                <Star size={14} color={colors.orange} />
                <Text style={styles.statText}>{course.rating}</Text>
              </View>
            </View>
            
            {course.progress && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{course.progress}% complete</Text>
              </View>
            )}
            
            <TouchableOpacity style={styles.continueButton}>
              <Play size={16} color="white" />
              <Text style={styles.continueButtonText}>
                {course.progress ? 'Continue Learning' : 'Start Course'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderArticles = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Latest Articles</Text>
      {articles.map((article) => (
        <TouchableOpacity key={article.id} style={styles.articleCard}>
          <Image source={{ uri: article.image }} style={styles.articleImage} />
          <View style={styles.articleContent}>
            <View style={styles.articleHeader}>
              <Text style={styles.categoryText}>{article.category}</Text>
              <Text style={styles.readTimeText}>{article.readTime}</Text>
            </View>
            <Text style={styles.articleTitle}>{article.title}</Text>
            <Text style={styles.articleExcerpt}>{article.excerpt}</Text>
            <Text style={styles.authorText}>By {article.author}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderProgress = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Learning Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <BookOpen size={24} color={colors.primary} />
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Courses Enrolled</Text>
          </View>
          <View style={styles.statCard}>
            <CheckCircle size={24} color={colors.green} />
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={24} color={colors.orange} />
            <Text style={styles.statValue}>12h</Text>
            <Text style={styles.statLabel}>Time Spent</Text>
          </View>
          <View style={styles.statCard}>
            <Award size={24} color={colors.purple} />
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.achievementsContainer}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {achievements.map((achievement, index) => (
          <View key={index} style={[
            styles.achievementCard,
            !achievement.earned && styles.lockedAchievement
          ]}>
            <Award 
              size={24} 
              color={achievement.earned ? colors.orange : colors.secondaryText} 
            />
            <View style={styles.achievementInfo}>
              <Text style={[
                styles.achievementTitle,
                !achievement.earned && styles.lockedText
              ]}>
                {achievement.title}
              </Text>
              <Text style={[
                styles.achievementDescription,
                !achievement.earned && styles.lockedText
              ]}>
                {achievement.description}
              </Text>
            </View>
            {achievement.earned && (
              <View style={styles.earnedBadge}>
                <CheckCircle size={20} color={colors.green} />
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Current Courses */}
      <View style={styles.currentCoursesContainer}>
        <Text style={styles.sectionTitle}>Continue Learning</Text>
        {courses.filter(course => course.progress && !course.completed).map((course) => (
          <TouchableOpacity key={course.id} style={styles.currentCourseCard}>
            <Image source={{ uri: course.image }} style={styles.currentCourseImage} />
            <View style={styles.currentCourseContent}>
              <Text style={styles.currentCourseTitle}>{course.title}</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{course.progress}% complete</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.playButton}>
              <Play size={16} color={colors.primary} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'courses':
        return renderCourses();
      case 'articles':
        return renderArticles();
      case 'progress':
        return renderProgress();
      default:
        return renderCourses();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Learn Trading',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }} 
      />
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { id: 'courses', name: 'Courses', icon: <BookOpen size={20} /> },
          { id: 'articles', name: 'Articles', icon: <BarChart3 size={20} /> },
          { id: 'progress', name: 'Progress', icon: <Award size={20} /> },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            {React.cloneElement(tab.icon, {
              color: activeTab === tab.id ? colors.primary : colors.secondaryText
            })}
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: colors.card,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondaryText,
  },
  activeTabText: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    margin: 16,
    marginBottom: 12,
  },
  courseCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  courseImage: {
    width: '100%',
    height: 120,
  },
  courseContent: {
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    color: colors.green,
    fontWeight: '500',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
    marginBottom: 12,
  },
  courseStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 6,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  articleImage: {
    width: 100,
    height: 100,
  },
  articleContent: {
    flex: 1,
    padding: 12,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  readTimeText: {
    fontSize: 10,
    color: colors.secondaryText,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  articleExcerpt: {
    fontSize: 12,
    color: colors.secondaryText,
    lineHeight: 16,
    marginBottom: 8,
  },
  authorText: {
    fontSize: 10,
    color: colors.secondaryText,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  achievementsContainer: {
    marginBottom: 24,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 12,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  lockedText: {
    color: colors.secondaryText,
  },
  earnedBadge: {
    marginLeft: 8,
  },
  currentCoursesContainer: {
    marginBottom: 32,
  },
  currentCourseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  currentCourseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  currentCourseContent: {
    flex: 1,
  },
  currentCourseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});