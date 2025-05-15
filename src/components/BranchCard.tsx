import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { BranchResponse } from '@pharmatech/sdk';
import { Colors, FontSizes } from '../styles/theme';
import PoppinsText from './PoppinsText';

type BranchCardProps = {
  branch: BranchResponse;
  onPress: () => void;
};

const BranchCard: React.FC<BranchCardProps> = ({ branch, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <PoppinsText style={styles.name}>{branch.name}</PoppinsText>
      <PoppinsText style={styles.address}>{branch.address}</PoppinsText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.menuWhite,
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: FontSizes.s2.size,
    lineHeight: FontSizes.s2.lineHeight,
    color: Colors.primary,
    marginBottom: 4,
  },
  address: {
    fontSize: FontSizes.b3.size,
    lineHeight: FontSizes.b3.lineHeight,
    color: Colors.textLowContrast,
  },
});

export default BranchCard;
