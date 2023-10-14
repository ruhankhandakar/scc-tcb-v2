import { FlatList } from 'react-native';
import type React from 'react';
import type { ScrollViewProps } from 'react-native';

interface IProps extends ScrollViewProps {}

type Props = React.FC<IProps>;

const ScrollViewComponent: Props = (props) => {
  return (
    <FlatList
      {...props}
      data={[]}
      keyExtractor={(_e, i) => 'dom' + i.toString()}
      ListEmptyComponent={null}
      renderItem={null}
      ListHeaderComponent={() => <>{props.children}</>}
    />
  );
};
export default ScrollViewComponent;
