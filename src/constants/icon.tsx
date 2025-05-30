import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type FeatherIconProps = Omit<ComponentProps<typeof Feather>, 'name'>;

export const icon = {
  index: (props: FeatherIconProps) => (
    <Feather name="home" size={24} {...props} />
  ),
  categories: (props: FeatherIconProps) => (
    <Feather name="list" size={24} {...props} />
  ),
  branches: (props: FeatherIconProps) => (
    <Feather name="map-pin" size={24} {...props} />
  ),
  offers: (props: FeatherIconProps) => (
    <Feather name="tag" size={24} {...props} />
  ),
  deliveryHistory: (props: FeatherIconProps) => (
    <Feather name="clock" size={24} {...props} />
  ),
};
