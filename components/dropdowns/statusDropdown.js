import React, {useState, useCallback, useEffect} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {StyleSheet} from 'react-native';
import {getStatuses} from '../../api/markers';

export default function statusDropdown({value, setValue}) {
  const [isFocus, setIsFocus] = useState(false);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    let isActive = true;

    const fetchStatuses = async () => {
      const data_status = await getStatuses();

      if (isActive) {
        setStatuses(data_status);
      }
    };

    fetchStatuses();
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <Dropdown
      style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={statuses}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={!value ? 'Seleccionar ' : value.label}
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={item => {
        setValue(item);
        setIsFocus(false);
      }}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    width: '80%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },

  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
