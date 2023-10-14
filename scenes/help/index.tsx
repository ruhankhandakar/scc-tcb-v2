import React from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import { Text } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';

import styles from './style';
import { COLORS } from 'constants/theme';

const links = [
  {
    title: 'অনলাইন ট্রেড লাইসেন্স',
    link: 'https://www.mygov.bd/public/serviceByOffice?agent=np&domain=scc.gov.bd',
  },
  {
    title: 'অনলাইন সনদের আবেদন',
    link: 'https://sonod.scc.gov.bd/',
  },
  {
    title: 'অনলাইন হোল্ডিং ট্যাক্স এন্ড এসেসমেন্ট',
    link: 'https://revenue.scc.gov.bd/',
  },
  {
    title: 'অযান্ত্রিক যানবাহন নিবন্ধনের আবেদন',
    link: 'https://citizen.scc.gov.bd/services/nm-vehicle?subMenu=dashboardv',
  },
  {
    title: 'অযান্ত্রিক যান চালকের ড্রাইভিং লাইসেন্স',
    link: 'https://citizen.scc.gov.bd/services/nm-vehicle?subMenu=dashboardv',
  },
  {
    title: 'স্থাপনা/ইমারত নির্মাণ নকশা অনুমোদনের আবেদন',
    link: 'https://citizen.scc.gov.bd/',
  },
];

const importantLinks = [
  {
    title: 'জন্ম ও মৃত্যু নিবন্ধন',
    link: 'http://bdris.gov.bd/br/application',
  },
  {
    title: 'ই-জিপি',
    link: 'https://www.eprocure.gov.bd/',
  },
  {
    link: 'http://www.lgd.gov.bd/',
    title: 'স্থানীয় সরকার মন্ত্রণালয়',
  },
];

const hotlines = [
  {
    title: 'সিসিক হটলাইন',
    link: '০১৯৬৯ ৯২২ ৭২২',
    actualNo: '01969922722',
  },
  {
    title: 'দুদক',
    link: '১০৬',
    actualNo: '106',
  },
  {
    title: 'জরুরি সেবা',
    link: '৯৯৯',
    actualNo: '999',
  },
  {
    title: 'নাগরিক সেবা',
    link: '৩৩৩',
    actualNo: '333',
  },
  {
    title: 'শিশু সহায়তা',
    link: '১০৯৮',
    actualNo: '1098',
  },
  {
    title: 'নারী ও শিশু নির্যাতন প্রতিরোধে',
    link: '১০৯',
    actualNo: '109',
  },
  {
    title: 'স্বাস্থ্য বাতায়ন',
    link: '১৬২৬৩',
    actualNo: '16263',
  },
  {
    title: 'দুর্যোগের আগাম বার্তা',
    link: '১০৯০',
    actualNo: '1090',
  },
  {
    title: 'ভূমি সেবা পেতে অভিযোগ',
    link: '১৬১২২',
    actualNo: '16122',
  },
  {
    title: 'জরুরী হটলাইন',
    link: '১৬৫৭৫',
    actualNo: '16575',
  },
];

const HelpScene = () => {
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>অভ্যন্তরীণ ই-সেবাসমূহ</Text>
        </View>
        <View style={styles.linkContainer}>
          {links.map((link) => (
            <TouchableOpacity
              key={link.title}
              style={styles.linkWrapper}
              onPress={() => {
                Linking.openURL(link.link);
              }}
            >
              <AntDesign name="link" size={24} color={COLORS.primary} />
              <Text style={styles.linkText} variant="labelMedium">
                {link.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>গুরুর্তপূর্ন লিঙ্ক সমূহ</Text>
        </View>
        <View style={styles.linkContainer}>
          {importantLinks.map((link) => (
            <TouchableOpacity
              key={link.title}
              style={styles.linkWrapper}
              onPress={() => {
                Linking.openURL(link.link);
              }}
            >
              <AntDesign name="link" size={24} color={COLORS.primary} />
              <Text
                style={styles.linkText}
                variant="labelMedium"
                lineBreakMode="tail"
                numberOfLines={1}
                ellipsizeMode="head"
              >
                {link.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>সিসিক হটলাইন</Text>
        </View>
        <View style={styles.linkContainer}>
          {hotlines.map((link) => (
            <TouchableOpacity
              key={link.title}
              style={styles.linkWrapper}
              onPress={() => {
                Linking.openURL(`tel:${link.actualNo}`);
              }}
            >
              <AntDesign name="phone" size={24} color={COLORS.primary} />
              <Text style={styles.linkText} variant="labelMedium">
                {link.title}
              </Text>
              <Text
                style={styles.linkTextLink}
                variant="labelMedium"
                lineBreakMode="tail"
                numberOfLines={1}
                ellipsizeMode="head"
              >
                {link.link}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default HelpScene;
