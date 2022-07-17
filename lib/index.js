import React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export default class ScrollingButtonMenu extends React.Component {

    constructor(props) {
        super(props);

        this.scroll = React.createRef();
        this.dataSourceCords = [];

        this.state = {
            index: '',
        };
    }

    componentDidUpdate(prevProps) {
        const {selected} = this.props;
        if (this.props.selected != this.state.index) {
            this.setState({index: selected}, () => {
                this._scrollTo();
            });
        }
    }

    componentDidMount() {
        const {selected} = this.props;
        console.log('selected',selected);
        this.setState({index: selected}, () => {
            setTimeout(() => {
                this._scrollTo();
            }, 200);
        });
    }

    _scrollTo() {

        const {index} = this.state;
        const screen1 = screenWidth / 2;
        const elementOffset = this.dataSourceCords[index];
        if (elementOffset !== undefined && typeof this.scroll.scrollTo == 'function') {
            let x = elementOffset.x - (screen1 - (elementOffset.width / 2));
            this.scroll.scrollTo({
                y: 0,
                x: x,
                animated: true,
            });
        }

    }

    render() {
        const {
            items,
            upperCase,
            selectedOpacity,
            activeBackgroundColor,
            activeColor,
            textStyle,
            buttonStyle,
            containerStyle,
            keyboardShouldPersistTaps
        } = this.props;
        const {index} = this.state;

        console.log('a',index);

        return (
            <View style={[
                styles.scrollArea,
                containerStyle,
            ]}>
                <ScrollView
                    horizontal={true}
                    pagingEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    ref={(node) => this.scroll = node}
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContainer}
                    scrollEventThrottle={200}
                    lazy={false}
                    keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                >
                    {
                        items.map((route, i) => (
                            <TouchableOpacity
                                style={[
                                    styles.tabItem,
                                    (index === route.id ? styles.tabItemFocused : {}),
                                    (buttonStyle ? buttonStyle : false),
                                    (index === route.id && activeBackgroundColor ? {backgroundColor: activeBackgroundColor} : false),
                                ]}
                                key={(route.id ? route.id : i).toString()}
                                onPress={() => this.setState({index: route.id}, () => setTimeout(() => {
                                        this._scrollTo();
                                        return this.props.onPress(route);
                                    }, 50),
                                )}
                                onLayout={(event) => {
                                    const layout = event.nativeEvent.layout;
                                    this.dataSourceCords[route.id] = layout;
                                }}
                                activeOpacity={selectedOpacity}
                            >
                                <Text style={[
                                    styles.tabItemText,
                                    (textStyle ? textStyle : false),
                                    (index == route.id ? styles.tabItemTextFocused : {}),
                                    (index == route.id && activeColor ? {color: activeColor} : false),
                                ]}>
                                    {upperCase ? route.name.toUpperCase() : route.name}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            </View>
        );
    }
}

ScrollingButtonMenu.propTypes = {
    items: PropTypes.array.isRequired,
    onPress: PropTypes.func.isRequired,
    upperCase: PropTypes.bool,
    textStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    activeColor: PropTypes.string,
    activeBackgroundColor: PropTypes.string,
    selected: PropTypes.number,
    selectedOpacity: PropTypes.number,
    containerStyle: PropTypes.object,
    keyboardShouldPersistTaps: PropTypes.string,
};

ScrollingButtonMenu.defaultProps = {
    upperCase: false,
    textStyle: {
    },
    buttonStyle: {
        borderRadius: 4,
        marginRight: 10,
    },
    activeColor: '',
    activeBackgroundColor: '#1e1e1e',
    selected: '',
    onPress: () => {

    },
    selectedOpacity: 0.7,
    containerStyle: {},
    keyboardShouldPersistTaps: 'always',
};

const styles = StyleSheet.create({
    scrollArea: {
        paddingLeft: 20,
        paddingTop: 20,
    },
    scroll: {},
    scrollContainer: {},
    tabItem: {
        borderRadius: 18,
        borderColor: '#858585',
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 6,
        paddingLeft: 15,
        paddingRight: 15,
        marginRight: 10,
    },
    tabItemText: {
        color: '#5d5d5d',
        fontFamily: 'AvenirNext-Medium',
        fontSize: 14,
        fontWeight: '500',
        fontStyle: 'normal',
        textAlign: 'left',
        lineHeight: 20,
    },
    tabItemFocused: {
        borderWidth: 0,
    },
    tabItemTextFocused: {
        color: '#fff',
    },
});
