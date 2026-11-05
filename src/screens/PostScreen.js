import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import SelectField from '../components/SelectField';
import DateField from '../components/DateField';
import SegmentedToggle from '../components/SegmentedToggle';
import PhotoPicker from '../components/PhotoPicker';
import HandoverPicker from '../components/HandoverPicker';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CATEGORY_NAMES, LOCATIONS, CONTACT_METHODS, categoryIcon, contactMethodInfo } from '../data/constants';
import { todayISO } from '../utils/format';
import { colors, radius, spacing, typography } from '../theme/colors';

const MAX_QUESTIONS = 3;

export default function PostScreen({ navigation }) {
  const { user } = useAuth();
  const { createItem } = useData();
  const scrollRef = useRef(null);

  const [type, setType] = useState('lost');
  const [imageUri, setImageUri] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState(null);
  const [date, setDate] = useState(todayISO());
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState(['', '']);
  const [contactMethod, setContactMethod] = useState('chat');
  const [contactValue, setContactValue] = useState('');
  const [handoverType, setHandoverType] = useState('dropoff');
  const [handoverPlace, setHandoverPlace] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const isFound = type === 'found';
  const method = contactMethodInfo(contactMethod);

  const pickContactMethod = (key) => {
    setContactMethod(key);
    // Pre-fill from the profile to save typing
    if (key === 'phone') setContactValue(user.phone || '');
    else if (key === 'email') setContactValue(user.email || '');
    else setContactValue('');
  };

  const setQuestion = (index, text) =>
    setQuestions((prev) => prev.map((q, i) => (i === index ? text : q)));

  const reset = () => {
    setType('lost');
    setImageUri(null);
    setTitle('');
    setCategory(null);
    setLocation(null);
    setDate(todayISO());
    setDescription('');
    setQuestions(['', '']);
    setContactMethod('chat');
    setContactValue('');
    setHandoverType('dropoff');
    setHandoverPlace(null);
    setErrors({});
    scrollRef.current && scrollRef.current.scrollTo({ y: 0, animated: false });
  };

  const submit = () => {
    const e = {};
    const filledQuestions = questions.map((q) => q.trim()).filter(Boolean);
    if (!title.trim()) e.title = 'Give the item a short name';
    if (!category) e.category = 'Choose a category';
    if (!location) e.location = 'Choose where it happened';
    if (filledQuestions.length === 0) e.questions = 'Add at least one verification question';
    if (contactMethod !== 'chat' && !contactValue.trim()) e.contact = `Enter your ${method.label.toLowerCase()} details`;
    if (isFound && handoverType !== 'keeps' && !handoverPlace) e.handover = 'Choose where the handover will happen';
    setErrors(e);
    if (Object.keys(e).length) {
      Alert.alert('Almost there', 'Please fix the highlighted fields.');
      return;
    }

    setSaving(true);
    const { item, matchCount } = createItem({
      type,
      title: title.trim(),
      description: description.trim(),
      category,
      location,
      date,
      imageUri,
      icon: categoryIcon(category),
      questions: filledQuestions,
      contactMethod,
      contactValue: contactMethod === 'chat' ? '' : contactValue.trim(),
      handover: isFound ? { type: handoverType, place: handoverType === 'keeps' ? null : handoverPlace } : null,
    });
    setSaving(false);
    reset();

    const matchText =
      matchCount > 0
        ? `We found ${matchCount} possible ${matchCount === 1 ? 'match' : 'matches'}. Open your post to compare.`
        : 'We will alert you if something similar is posted.';
    Alert.alert('Post submitted', matchText);
    navigation.navigate('ItemDetails', { itemId: item.id });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Post an Item</Text>

          <SegmentedToggle
            options={[{ key: 'lost', label: 'Lost' }, { key: 'found', label: 'Found' }]}
            value={type}
            onChange={setType}
            style={styles.toggle}
          />

          <PhotoPicker
            uri={imageUri}
            onChange={setImageUri}
            hint={isFound ? 'A clear photo helps the owner recognise it' : 'Tap to add a photo (optional)'}
            style={styles.photo}
          />

          <CustomInput
            label="Item Title"
            placeholder="Enter item name"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
            maxLength={60}
          />
          <SelectField
            label="Category"
            placeholder="Select category"
            options={CATEGORY_NAMES}
            value={category}
            onSelect={setCategory}
            error={errors.category}
          />
          <SelectField
            label={isFound ? 'Where did you find it?' : 'Where did you lose it?'}
            placeholder="Select location"
            icon="location-outline"
            options={LOCATIONS}
            value={location}
            onSelect={setLocation}
            error={errors.location}
          />
          <DateField label={isFound ? 'Date found' : 'Date lost'} value={date} onChange={setDate} />
          <CustomInput
            label="Description"
            placeholder="Add more details (colour, brand, marks)..."
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={300}
          />

          {/* Verification questions */}
          <View style={styles.verifyCard}>
            <View style={styles.verifyHead}>
              <Ionicons name="shield-checkmark" size={22} color={colors.text} />
              <View style={styles.verifyHeadText}>
                <Text style={styles.verifyTitle}>Verification Questions</Text>
                <Text style={styles.verifySub}>
                  {isFound
                    ? 'Ask about a detail you did NOT put in the post. Only the real owner will know it.'
                    : 'Ask something only the person who really has your item could answer.'}
                </Text>
              </View>
            </View>
            {questions.map((q, i) => (
              <CustomInput
                key={i}
                placeholder={i === 0 ? (isFound ? 'e.g. What colour is the phone case?' : 'e.g. What is inside the wallet?') : `Question ${i + 1} (optional)`}
                value={q}
                onChangeText={(t) => setQuestion(i, t)}
                style={styles.questionInput}
                maxLength={100}
              />
            ))}
            {questions.length < MAX_QUESTIONS ? (
              <Pressable
                onPress={() => setQuestions((prev) => [...prev, ''])}
                style={styles.addQuestion}
                accessibilityRole="button"
              >
                <Ionicons name="add-circle-outline" size={20} color={colors.text} />
                <Text style={styles.addQuestionText}>Add another question</Text>
              </Pressable>
            ) : null}
            {errors.questions ? <Text style={styles.error}>{errors.questions}</Text> : null}
          </View>

          {/* Contact method */}
          <Text style={styles.sectionTitle}>How should people reach you?</Text>
          <Text style={styles.sectionSub}>
            <Ionicons name="lock-closed-outline" size={13} color={colors.textMuted} /> Hidden until someone submits a claim.
          </Text>
          <View style={styles.optionWrap}>
            {CONTACT_METHODS.map((m) => {
              const active = m.key === contactMethod;
              return (
                <Pressable
                  key={m.key}
                  onPress={() => pickContactMethod(m.key)}
                  style={[styles.option, active && styles.optionActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Ionicons name={m.icon} size={18} color={colors.text} />
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>{m.label}</Text>
                </Pressable>
              );
            })}
          </View>
          {contactMethod !== 'chat' ? (
            <CustomInput
              placeholder={method.placeholder}
              value={contactValue}
              onChangeText={setContactValue}
              keyboardType={method.keyboard}
              autoCapitalize="none"
              error={errors.contact}
            />
          ) : null}

          {/* Handover (Found posts only; on a Lost post the finder chooses when they reply) */}
          {isFound ? (
            <View>
              <Text style={styles.sectionTitle}>Handover</Text>
              <Text style={styles.sectionSub}>Valuables (wallet, phone, ID) are safest at a drop-off point.</Text>
              <HandoverPicker
                type={handoverType}
                place={handoverPlace}
                onChangeType={setHandoverType}
                onChangePlace={setHandoverPlace}
                error={errors.handover}
              />
            </View>
          ) : null}

          <CustomButton title="Submit Post" onPress={submit} loading={saving} style={styles.submit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { ...typography.title, textAlign: 'center', marginBottom: spacing.lg },
  toggle: { marginBottom: spacing.lg },
  photo: { marginBottom: spacing.lg },

  verifyCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  verifyHead: { flexDirection: 'row', marginBottom: spacing.md },
  verifyHeadText: { flex: 1, marginLeft: spacing.md },
  verifyTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  verifySub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  questionInput: { marginBottom: spacing.sm },
  addQuestion: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs },
  addQuestionText: { marginLeft: spacing.xs, fontSize: 14, fontWeight: '600', color: colors.text },
  error: { marginTop: spacing.xs, fontSize: 13, color: colors.danger },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  sectionSub: { fontSize: 13, color: colors.textMuted, marginTop: 2, marginBottom: spacing.md },
  optionWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  optionActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionText: { marginLeft: 6, fontSize: 13, fontWeight: '600', color: colors.text },
  optionTextActive: { fontWeight: '700' },


  submit: { marginTop: spacing.md },
});
