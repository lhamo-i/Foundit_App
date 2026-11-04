import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import FilterTabs from '../components/FilterTabs';
import Dropdown from '../components/Dropdown';
import { CATEGORIES, LOCATIONS } from '../utils/constants';
import { todayString, yesterdayString } from '../utils/dates';
import { validateRequired, validateItemDate } from '../utils/validation';
import { colors, radius, spacing, typography } from '../theme/colors';

const emptyQuestion = () => ({ question: '', answer: '' });

export default function PostItemScreen({ navigation }) {
  const [type, setType] = useState('Lost');
  const [photoUri, setPhotoUri] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(todayString());
  const [questions, setQuestions] = useState([emptyQuestion(), emptyQuestion()]);
  const [errors, setErrors] = useState({});

  const isFound = type === 'Found';

  const updateQuestion = (index, field, text) => {
    setQuestions((current) =>
      current.map((q, i) => (i === index ? { ...q, [field]: text } : q))
    );
  };
  const addQuestion = () => {
    if (questions.length < 3) setQuestions([...questions, emptyQuestion()]);
  };
  const removeQuestion = (index) => {
    if (questions.length > 2) setQuestions(questions.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setType('Lost');
    setPhotoUri('');
    setTitle('');
    setDescription('');
    setCategory('');
    setLocation('');
    setDate(todayString());
    setQuestions([emptyQuestion(), emptyQuestion()]);
    setErrors({});
  };

  const handlePhoto = async () => {
    // The photo stays on the phone for now. STAGE 3 uploads it to Firebase Storage.
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled) setPhotoUri(result.assets[0].uri);
    } catch (error) {
      Alert.alert('Could not open photos', 'Please try again.');
    }
  };

  const handleSubmit = () => {
    const newErrors = {
      title: validateRequired(title, 'Item title'),
      description: validateRequired(description, 'Description'),
      category: category ? '' : 'Please choose a category',
      location: location ? '' : 'Please choose a location',
      date: validateItemDate(date),
      questions: '',
    };

    if (isFound) {
      const incomplete = questions.some((q) => !q.question.trim() || !q.answer.trim());
      if (incomplete) {
        newErrors.questions = 'Fill in every question and its answer (2 to 3 questions).';
      }
    }

    setErrors(newErrors);
    if (Object.values(newErrors).some((message) => message)) return;

    // STAGE 3: saves the public post to "items" and the private answers to
    // "privateVerification" (answers are hashed on the server, never stored in plain text).
    Alert.alert(
      'Form is valid',
      `Your ${type.toLowerCase()} report will be saved to Firebase in Stage 3.`,
      [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Post an Item" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FilterTabs
            options={['Lost', 'Found']}
            selected={type}
            onSelect={setType}
            style={styles.tabs}
          />

          <Pressable
            style={[styles.photoBox, !!photoUri && styles.photoBoxFilled]}
            onPress={handlePhoto}
            accessibilityRole="button"
            accessibilityLabel={photoUri ? 'Change photo' : 'Upload photo'}
          >
            {photoUri ? (
              <>
                <Image source={{ uri: photoUri }} style={styles.photoPreview} resizeMode="cover" />
                <View style={styles.photoChange}>
                  <Ionicons name="camera-outline" size={16} color={colors.text} />
                  <Text style={styles.photoChangeText}>Change photo</Text>
                </View>
              </>
            ) : (
              <>
                <Ionicons name="image-outline" size={40} color={colors.text} />
                <Text style={styles.photoTitle}>Upload Photo</Text>
                <Text style={typography.caption}>Tap to add a photo</Text>
              </>
            )}
          </Pressable>

          <CustomInput
            label="Item title"
            placeholder="e.g. Black Wallet"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />
          <Dropdown
            label="Category"
            placeholder="Select category"
            options={CATEGORIES}
            value={category}
            onChange={setCategory}
            error={errors.category}
          />
          <Dropdown
            label="Campus location"
            placeholder="Select location"
            options={LOCATIONS}
            value={location}
            onChange={setLocation}
            error={errors.location}
          />

          <CustomInput
            label={isFound ? 'Date found' : 'Date lost'}
            icon="calendar-outline"
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
            keyboardType="numbers-and-punctuation"
            autoCorrect={false}
            error={errors.date}
            style={styles.dateInput}
          />
          <View style={styles.quickDates}>
            <Pressable style={styles.chip} onPress={() => setDate(todayString())}>
              <Text style={styles.chipText}>Today</Text>
            </Pressable>
            <Pressable style={styles.chip} onPress={() => setDate(yesterdayString())}>
              <Text style={styles.chipText}>Yesterday</Text>
            </Pressable>
          </View>

          <CustomInput
            label="Description"
            placeholder="Colour, brand, size, marks... (do not give away private details)"
            value={description}
            onChangeText={setDescription}
            multiline
            error={errors.description}
          />

          {isFound ? (
            <View style={styles.verifyBox}>
              <View style={styles.verifyHeader}>
                <Ionicons name="shield-checkmark-outline" size={24} color={colors.text} />
                <View style={styles.verifyHeaderText}>
                  <Text style={styles.verifyTitle}>Private verification questions</Text>
                  <Text style={typography.caption}>
                    Add 2 to 3 questions only the real owner could answer. The answers are never
                    shown publicly.
                  </Text>
                </View>
              </View>

              {questions.map((q, index) => (
                <View key={index} style={styles.questionBlock}>
                  <View style={styles.questionTop}>
                    <Text style={styles.questionNumber}>Question {index + 1}</Text>
                    {questions.length > 2 ? (
                      <Pressable
                        onPress={() => removeQuestion(index)}
                        hitSlop={10}
                        accessibilityLabel={`Remove question ${index + 1}`}
                      >
                        <Ionicons name="trash-outline" size={20} color={colors.danger} />
                      </Pressable>
                    ) : null}
                  </View>
                  <CustomInput
                    placeholder="e.g. What brand is it?"
                    value={q.question}
                    onChangeText={(text) => updateQuestion(index, 'question', text)}
                    style={styles.tightInput}
                  />
                  <CustomInput
                    placeholder="Correct answer (private)"
                    value={q.answer}
                    onChangeText={(text) => updateQuestion(index, 'answer', text)}
                    style={styles.tightInput}
                  />
                </View>
              ))}

              {errors.questions ? <Text style={styles.questionError}>{errors.questions}</Text> : null}

              {questions.length < 3 ? (
                <CustomButton
                  title="Add another question"
                  variant="outline"
                  icon="add"
                  onPress={addQuestion}
                />
              ) : null}
            </View>
          ) : null}

          <CustomButton title="Submit Post" variant="dark" onPress={handleSubmit} style={styles.submit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  tabs: { marginBottom: spacing.lg },
  photoBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
  },
  photoBoxFilled: { paddingVertical: 0, borderStyle: 'solid', overflow: 'hidden' },
  photoPreview: { width: '100%', height: 220 },
  photoChange: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  photoChangeText: { fontSize: 13, fontWeight: '600', color: colors.text, marginLeft: 4 },
  photoTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  dateInput: { marginBottom: spacing.sm },
  quickDates: { flexDirection: 'row', marginBottom: spacing.lg },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.text },
  verifyBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  verifyHeader: { flexDirection: 'row', marginBottom: spacing.md },
  verifyHeaderText: { flex: 1, marginLeft: spacing.sm },
  verifyTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 2 },
  questionBlock: { marginBottom: spacing.sm },
  questionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  questionNumber: { fontSize: 14, fontWeight: '700', color: colors.text },
  tightInput: { marginBottom: spacing.sm },
  questionError: { fontSize: 13, color: colors.danger, marginBottom: spacing.md },
  submit: { marginTop: spacing.sm },
});
