import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, Platform, StatusBar, Animated, Modal,
  KeyboardAvoidingView, TextInput, Alert,
} from 'react-native';

const PRAYERS = [
  { id: 'fajr',    name: 'بەیانی',  nameEn: 'Fajr',    arabic: 'الفجر',  emoji: '🌙', defaultTime: '05:00' },
  { id: 'dhuhr',   name: 'نیوەرۆ',  nameEn: 'Dhuhr',   arabic: 'الظهر',  emoji: '☀️', defaultTime: '12:30' },
  { id: 'asr',     name: 'عەسر',    nameEn: 'Asr',     arabic: 'العصر',  emoji: '🌤', defaultTime: '15:45' },
  { id: 'maghrib', name: 'ئیوارە',  nameEn: 'Maghrib', arabic: 'المغرب', emoji: '🌅', defaultTime: '18:15' },
  { id: 'isha',    name: 'عیشا',    nameEn: "Isha'a",  arabic: 'العشاء', emoji: '🌟', defaultTime: '19:45' },
];

function pad(n) { return String(n).padStart(2, '0'); }

function defaultData() {
  const d = {};
  PRAYERS.forEach(p => { d[p.id] = { time: p.defaultTime, enabled: true }; });
  return d;
}

function getNextPrayer(data) {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  for (const p of PRAYERS) {
    if (!data[p.id].enabled) continue;
    const [h, m] = data[p.id].time.split(':').map(Number);
    if (h * 60 + m > nowMins) return { ...p, time: data[p.id].time };
  }
  const first = PRAYERS.find(p => data[p.id].enabled);
  return first ? { ...first, time: data[first.id].time } : null;
}

const C = {
  bg: '#0e1117', surface: '#161b22', card: '#1c2128',
  border: '#30363d', gold: '#d4a017', goldDim: '#8a6810',
  text: '#e6edf3', muted: '#7d8590',
  active: '#1f3a5a', activeBorder: '#388bfd',
};

export default function App() {
  const [data, setData] = useState(defaultData());
  const [now, setNow] = useState(new Date());
  const [lang, setLang] = useState('ku');
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTime, setEditTime] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const getCountdown = () => {
    const next = getNextPrayer(data);
    if (!next) return '--:--:--';
    const [h, m] = next.time.split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const diff = Math.floor((target - now) / 1000);
    return pad(Math.floor(diff / 3600)) + ':' + pad(Math.floor((diff % 3600) / 60)) + ':' + pad(diff % 60);
  };

  const openEdit = (id) => {
    setEditId(id);
    setEditTime(data[id].time);
    setModalVisible(true);
  };

  const confirmEdit = () => {
    if (!/^\d{2}:\d{2}$/.test(editTime)) {
      Alert.alert('هەڵە', 'تکایە فۆرماتی دروست بنووسە: HH:MM');
      return;
    }
    setData(d => ({ ...d, [editId]: { ...d[editId], time: editTime } }));
    setModalVisible(false);
  };

  const next = getNextPrayer(data);
  const nowMins = now.getHours() * 60 + now.getMinutes();

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <Animated.ScrollView style={{ opacity: fadeAnim }} contentContainerStyle={s.scroll}>

        <View style={s.header}>
          <Text style={s.mosque}>🕌</Text>
          <Text style={s.title}>{lang === 'ku' ? 'کاتی بانگ' : 'Prayer Times'}</Text>
          <Text style={s.subtitle}>{lang === 'ku' ? 'یادەوەری نوێژی ڕۆژانە' : 'Daily Prayer Reminder'}</Text>
          <TouchableOpacity style={s.langBtn} onPress={() => setLang(l => l === 'ku' ? 'en' : 'ku')}>
            <Text style={s.langBtnText}>{lang === 'ku' ? 'English' : 'کوردی'}</Text>
          </TouchableOpacity>
        </View>

        <View style={s.clockCard}>
          <Text style={s.clockTime}>{pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds())}</Text>
          {next && (
            <View style={s.nextRow}>
              <Text style={s.nextLabel}>{lang === 'ku' ? 'داهاتوو: ' : 'Next: '}</Text>
              <Text style={s.nextName}>{lang === 'ku' ? next.name : next.nameEn}</Text>
              <Text style={s.nextTime}>{' — ' + next.time}</Text>
            </View>
          )}
        </View>

        <View style={s.countdownCard}>
          <Text style={s.countdownLabel}>{lang === 'ku' ? 'کات تا نوێژی داهاتوو' : 'Time until next prayer'}</Text>
          <Text style={s.countdownValue}>{getCountdown()}</Text>
        </View>

        <Text style={s.sectionLabel}>{lang === 'ku' ? 'کاتەکانی نوێژ' : 'Prayer Schedule'}</Text>

        {PRAYERS.map(p => {
          const pd = data[p.id];
          const [ph, pm] = pd.time.split(':').map(Number);
          const passed = ph * 60 + pm < nowMins;
          const isNext = next && next.id === p.id;
          return (
            <View key={p.id} style={[s.pCard, isNext && s.pCardActive, passed && !isNext && s.pCardPassed]}>
              <View style={s.pLeft}>
                <View style={[s.pIconBox, isNext && s.pIconActive]}>
                  <Text style={{ fontSize: 24 }}>{p.emoji}</Text>
                </View>
                <View>
                  <Text style={[s.pName, passed && !isNext && s.pNamePassed]}>
                    {lang === 'ku' ? p.name : p.nameEn}
                  </Text>
                  <Text style={s.pArabic}>{p.arabic}</Text>
                  {isNext && <Text style={s.pTagNext}>{lang === 'ku' ? '⬆ داهاتوو' : '⬆ Next'}</Text>}
                  {passed && !isNext && <Text style={s.pTagPassed}>{lang === 'ku' ? 'تێپەربوو' : 'Passed'}</Text>}
                </View>
              </View>
              <View style={s.pRight}>
                <Text style={[s.pTime, isNext && { color: C.gold }]}>{pd.time}</Text>
                <TouchableOpacity style={s.editBtn} onPress={() => openEdit(p.id)}>
                  <Text style={s.editBtnText}>{lang === 'ku' ? 'گۆڕین' : 'Edit'}</Text>
                </TouchableOpacity>
                <Switch
                  value={pd.enabled}
                  onValueChange={v => setData(d => ({ ...d, [p.id]: { ...d[p.id], enabled: v } }))}
                  trackColor={{ false: C.border, true: C.goldDim }}
                  thumbColor={pd.enabled ? C.gold : C.muted}
                />
              </View>
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </Animated.ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>{lang === 'ku' ? 'کاتی نوێژ دیاریبکە' : 'Set Prayer Time'}</Text>
            <Text style={s.modalSub}>
              {PRAYERS.find(p => p.id === editId)?.[lang === 'ku' ? 'name' : 'nameEn']}
            </Text>
            <TextInput
              style={s.timeInput}
              value={editTime}
              onChangeText={setEditTime}
              placeholder="HH:MM"
              placeholderTextColor={C.muted}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              autoFocus
            />
            <Text style={s.modalHint}>نموونە: 05:30 یان 18:45</Text>
            <View style={s.modalBtns}>
              <TouchableOpacity style={[s.modalBtn, s.cancelBtn]} onPress={() => setModalVisible(false)}>
                <Text style={s.cancelText}>{lang === 'ku' ? 'هەڵوەشاندنەوە' : 'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modalBtn, s.saveBtn]} onPress={confirmEdit}>
                <Text style={s.saveText}>{lang === 'ku' ? 'پاراستن' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 48, paddingBottom: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  mosque: { fontSize: 48, marginBottom: 6 },
  title: { fontSize: 28, fontWeight: '800', color: C.gold },
  subtitle: { fontSize: 13, color: C.muted, marginTop: 4 },
  langBtn: { marginTop: 12, borderWidth: 1, borderColor: C.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 5 },
  langBtnText: { color: C.muted, fontSize: 13 },
  clockCard: { backgroundColor: C.surface, borderRadius: 18, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: C.border, marginBottom: 10 },
  clockTime: { fontSize: 48, fontWeight: '700', color: C.gold },
  nextRow: { flexDirection: 'row', marginTop: 8, alignItems: 'center' },
  nextLabel: { color: C.muted, fontSize: 14 },
  nextName: { color: C.text, fontSize: 15, fontWeight: '600' },
  nextTime: { color: C.gold, fontSize: 14 },
  countdownCard: { backgroundColor: C.card, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: C.goldDim + '55', marginBottom: 10 },
  countdownLabel: { fontSize: 12, color: C.muted, marginBottom: 4 },
  countdownValue: { fontSize: 30, fontWeight: '700', color: C.gold, letterSpacing: 3 },
  sectionLabel: { fontSize: 13, color: C.muted, fontWeight: '600', marginBottom: 10 },
  pCard: { backgroundColor: C.card, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, borderWidth: 1, borderColor: C.border },
  pCardActive: { backgroundColor: C.active, borderColor: C.activeBorder },
  pCardPassed: { opacity: 0.5 },
  pLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  pIconBox: { width: 46, height: 46, borderRadius: 12, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  pIconActive: { borderColor: C.activeBorder, backgroundColor: C.active },
  pName: { fontSize: 17, fontWeight: '700', color: C.text },
  pNamePassed: { textDecorationLine: 'line-through', color: C.muted },
  pArabic: { fontSize: 12, color: C.muted, marginTop: 1 },
  pTagNext: { fontSize: 11, color: C.gold, marginTop: 3, fontWeight: '600' },
  pTagPassed: { fontSize: 11, color: C.muted, marginTop: 3 },
  pRight: { alignItems: 'center', gap: 6 },
  pTime: { fontSize: 20, fontWeight: '700', color: C.text },
  editBtn: { borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  editBtnText: { color: C.muted, fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, borderWidth: 1, borderColor: C.border },
  modalTitle: { fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 4 },
  modalSub: { fontSize: 14, color: C.gold, marginBottom: 20 },
  timeInput: { backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.border, color: C.gold, fontSize: 32, fontWeight: '700', textAlign: 'center', paddingVertical: 14, letterSpacing: 4 },
  modalHint: { fontSize: 12, color: C.muted, textAlign: 'center', marginTop: 8, marginBottom: 20 },
  modalBtns: { flexDirection: 'row', gap: 12 },
  modalBtn: { flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  cancelBtn: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  cancelText: { color: C.muted, fontSize: 16, fontWeight: '600' },
  saveBtn: { backgroundColor: C.gold },
  saveText: { color: '#000', fontSize: 16, fontWeight: '700' },
});
