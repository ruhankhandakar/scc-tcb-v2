import { Alert, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import React, { useRef, useState } from 'react';
import { COLORS, FONT, SIZES } from 'constants/theme';
import { Entypo } from '@expo/vector-icons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { useRouter, useSegments } from 'expo-router';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useBackEndContext } from 'context/BackEndContext';
import { ActivateDealerParam } from 'utils/types';

type BottomSheetType = 'rejection' | 'approval' | 'update';

const PendingActionList = () => {
  const router = useRouter();

  return (
    <>
      <MenuOption
        onSelect={() => {
          router.push('/settings/pending_actions');
        }}
      >
        <Text style={[styles.menuText, styles.approveText]}>Approve</Text>
      </MenuOption>
      <MenuOption
        onSelect={() => {
          router.push('/settings/pending_actions');
        }}
      >
        <Text style={[styles.menuText, styles.rejectText]}>Reject</Text>
      </MenuOption>
    </>
  );
};

const VerifiedActionList = ({
  handleDeactivate,
  updateData,
}: {
  handleDeactivate: () => void;
  updateData: () => void;
}) => {
  return (
    <>
      <MenuOption
        onSelect={() => {
          updateData();
        }}
      >
        <Text style={[styles.menuText]}>Update Data</Text>
      </MenuOption>
      <MenuOption
        onSelect={() => {
          handleDeactivate();
        }}
      >
        <Text style={[styles.menuText, styles.rejectText]}>Deactivate</Text>
      </MenuOption>
    </>
  );
};

const Activate = ({ handleActivate }: { handleActivate: () => void }) => {
  return (
    <>
      <MenuOption
        onSelect={() => {
          handleActivate();
        }}
      >
        <Text style={[styles.menuText, styles.approveText]}>Activate</Text>
      </MenuOption>
    </>
  );
};

const DealerActionMenu = ({
  isVerified = false,
  dealerId,
  remarks,
  isActive,
  fetchedRegisteredCustomerNumber,
}: {
  isVerified: boolean;
  isActive: boolean;
  dealerId: number;
  remarks?: string;
  fetchedRegisteredCustomerNumber?: number | undefined;
}) => {
  const segments = useSegments();
  const router = useRouter();

  const [_remarks, setRemarks] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [bottomSheetView, setBottomSheetView] = useState<BottomSheetType>();
  const [registeredCustomerNumber, setRegisteredCustomerNumber] = useState<
    string | undefined
  >(() =>
    fetchedRegisteredCustomerNumber
      ? fetchedRegisteredCustomerNumber.toString()
      : undefined
  );

  const {
    actions: { activateDealer },
  } = useBackEndContext();

  const toggleBottomSheet = (type: BottomSheetType) => {
    setBottomSheetView(type);
    bottomSheetModalRef?.current?.present();
  };

  const reload = () => {
    // @ts-ignore
    router.replace(segments.join('/'));
  };

  const handleRejectSubmit = async () => {
    setSubmitting(true);
    const payload = {
      actionType: 'deactivate',
      dealerId,
      remarks: _remarks,
    } as ActivateDealerParam;

    const response = await activateDealer(payload);

    if (response.success) {
      bottomSheetModalRef?.current?.close();
      reload();
    }
    setSubmitting(false);
  };

  const handleApproval = async () => {
    if (
      !registeredCustomerNumber ||
      isNaN(parseFloat(registeredCustomerNumber))
    ) {
      Alert.alert('নাম্বার ভ্যালিড নয়');
      return;
    }
    setSubmitting(true);
    const response = await activateDealer({
      actionType: 'accept',
      dealerId,
      registered_customer: +registeredCustomerNumber,
    });

    if (response.success) {
      bottomSheetModalRef?.current?.close();
      reload();
    }

    setSubmitting(false);
  };

  const isDeactivated = !isActive;

  return (
    <>
      <Menu>
        <MenuTrigger>
          <Entypo
            name="dots-three-vertical"
            size={24}
            color={COLORS.secondary}
          />
        </MenuTrigger>
        <MenuOptions optionsContainerStyle={styles.menuOption}>
          {isDeactivated && (
            <Activate
              handleActivate={() => {
                toggleBottomSheet('approval');
              }}
            />
          )}
          {!isVerified && !isDeactivated && <PendingActionList />}
          {isVerified && !isDeactivated && (
            <VerifiedActionList
              handleDeactivate={() => {
                toggleBottomSheet('rejection');
              }}
              updateData={() => {
                toggleBottomSheet('update');
              }}
            />
          )}
        </MenuOptions>
      </Menu>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={['40%']}
        backgroundStyle={{
          borderRadius: SIZES.medium,
          backgroundColor: COLORS.white,
        }}
      >
        <View style={styles.bottomSheetContainer}>
          <View>
            <Text style={styles.acceptViewText}>
              {bottomSheetView === 'rejection'
                ? 'অনুগ্রহ করে নিষ্ক্রিয় করার কারন লিখুন'
                : 'নিবন্ধিত উপকারভোগকারির সংখ্যা দিন'}
            </Text>
            <View style={[styles.inputContainer, styles.remarksInputContainer]}>
              {(bottomSheetView === 'approval' ||
                bottomSheetView === 'update') && (
                <TextInput
                  style={styles.input}
                  value={registeredCustomerNumber}
                  placeholder="এখানে নাম্বার লিখুন"
                  placeholderTextColor={COLORS.gray}
                  onChangeText={(text: string) => {
                    setRegisteredCustomerNumber(text);
                  }}
                  keyboardType="phone-pad"
                />
              )}
              {bottomSheetView === 'rejection' && (
                <TextInput
                  style={styles.input}
                  value={_remarks}
                  placeholder="এখানে লিখুন"
                  placeholderTextColor={COLORS.gray}
                  onChangeText={(text: string) => {
                    setRemarks(text);
                  }}
                  multiline
                  numberOfLines={4}
                />
              )}
            </View>
            <Button
              mode="contained"
              buttonColor={COLORS.primary}
              disabled={
                (bottomSheetView === 'rejection' && !_remarks) ||
                (bottomSheetView === 'approval' && !registeredCustomerNumber) ||
                submitting
              }
              onPress={
                bottomSheetView === 'rejection'
                  ? handleRejectSubmit
                  : handleApproval
              }
            >
              {!submitting ? 'সাবমিট' : 'সাবমিট হচ্ছ...'}
            </Button>
          </View>
        </View>
      </BottomSheetModal>
    </>
  );
};

export default React.memo(DealerActionMenu);

const styles = StyleSheet.create({
  menuOption: {
    backgroundColor: COLORS.white,
    marginTop: 30,
    width: 'auto',
    minWidth: 100,
    borderRadius: SIZES.xSmall,
    padding: SIZES.small,
  },
  menuText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium - 3,
    textTransform: 'uppercase',
  },
  approveText: {
    color: COLORS.lightGreenDarken2,
  },
  rejectText: {
    color: COLORS.error,
  },
  bottomSheetContainer: {
    padding: SIZES.medium,
  },
  acceptViewText: {
    textAlign: 'center',
    color: COLORS.darkBlue,
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginLeft: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: 16,
    height: 50,
    marginTop: SIZES.medium,
  },
  remarksInputContainer: {
    height: 60,
    paddingHorizontal: 10,
  },
  input: {
    color: COLORS.darkBlue,
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 16,
  },
});
