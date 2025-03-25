// __mocks__/svgrMock.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';

const SvgrMock = (props: ViewProps) => <View testID="svg-mock" {...props} />;
export default SvgrMock;
