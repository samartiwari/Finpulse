import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import colors from '@/constants/colors';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
  animationType?: 'slide' | 'fade' | 'none';
}

export default function Modal({
  visible,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  animationType = 'slide',
}: ModalProps) {
  const isFullscreen = size === 'fullscreen';

  return (
    <RNModal
      visible={visible}
      animationType={animationType}
      transparent={!isFullscreen}
      onRequestClose={onClose}
    >
      {isFullscreen ? (
        <SafeAreaView style={styles.fullscreenContainer}>
          {title && (
            <View style={styles.fullscreenHeader}>
              <Text style={styles.fullscreenTitle}>{title}</Text>
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.fullscreenContent}>
            {children}
          </View>
        </SafeAreaView>
      ) : (
        <View style={styles.overlay}>
          <View style={[styles.modal, styles[size]]}>
            {title && (
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                {showCloseButton && (
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <X size={20} color={colors.text} />
                  </TouchableOpacity>
                )}
              </View>
            )}
            <View style={styles.content}>
              {children}
            </View>
          </View>
        </View>
      )}
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    maxHeight: '80%',
    width: '100%',
  },
  small: {
    maxWidth: 300,
  },
  medium: {
    maxWidth: 400,
  },
  large: {
    maxWidth: 500,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fullscreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fullscreenTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  fullscreenContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
});