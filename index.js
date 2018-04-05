import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    Animated,
    Platform,
} from 'react-native';

class FloatingLabel extends Component {
    constructor(props) {
        super(props);

        let initialPadding = 9;
        let initialOpacity = 0;

        if (this.props.visible) {
            initialPadding = 5;
            initialOpacity = 1;
        }

        this.state = {
            paddingAnim: new Animated.Value(initialPadding),
            opacityAnim: new Animated.Value(initialOpacity),
        };
    }

    componentWillReceiveProps(newProps) {
        Animated.timing(this.state.paddingAnim, {
            toValue: newProps.visible ? 5 : 9,
            duration: 230,
        }).start();

        return Animated.timing(this.state.opacityAnim, {
            toValue: newProps.visible ? 1 : 0,
            duration: 230,
        }).start();
    }

    render() {
        return (
            <Animated.View style={[styles.floatingLabel, { paddingTop: this.state.paddingAnim, opacity: this.state.opacityAnim }]}>
                {this.props.children}
            </Animated.View>
        );
    }
}

class TextFieldHolder extends Component {
    constructor(props) {
        super(props);

        const marginAnim = props.withValue
            ? props.marginAnim
            : (props.multiline ? props.marginMultiline : 0);
        this.state = {
            marginAnim: new Animated.Value(marginAnim),
        };
    }

    componentWillReceiveProps(newProps) {
        return Animated.timing(this.state.marginAnim, {
            toValue: newProps.withValue
                ? newProps.marginAnim
                : (newProps.multiline ? newProps.marginMultiline : 0),
            duration: 230,
        }).start();
    }

    render() {
        return (
            <Animated.View style={{
                flexGrow: 1,
                marginTop: this.state.marginAnim,
            }}>
                {this.props.children}
            </Animated.View>
        );
    }
}

class FloatLabelTextField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            text: this.props.value,
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.hasOwnProperty('value') /* && newProps.value !== this.state.text */) {
            this.setState({ text: newProps.value });
        }
    }

    withBorder() {
        if (!this.props.noBorder) {
            return styles.withBorder;
        }
    }

    renderIcon() {
        if (!this.props.icon) {
            return null;
        }
        return (<Image style={styles.icon} source={this.props.icon} />);
    }

    render() {
        return (
            <View style={styles.container}>
                <View
                    style={[
                        styles.viewContainer,
                        {
                            paddingTop: this.props.contentInset.top,
                            paddingLeft: this.props.contentInset.left,
                            paddingRight: this.props.contentInset.right,
                            paddingBottom: this.props.contentInset.bottom,
                        }
                    ]}>
                    <View style={[styles.fieldContainer, this.withBorder()]}>
                        <FloatingLabel visible={this.state.text}>
                            {this.renderIcon()}
                            <Text style={[styles.fieldLabel, this.props.floatingLabelStyle, this.labelStyle()]}>{this.placeholderValue()}</Text>
                        </FloatingLabel>
                        <TextFieldHolder
                            withValue={this.state.text}
                            marginAnim={this.props.marginAnim}
                            multiline={this.props.multiline}
                            marginMultiline={this.props.marginMultiline}
                        >
                            <TextInput
                                {...this.props}
                                ref="input"
                                // underlineColorAndroid="transparent"
                                style={[
                                    styles.valueText,
                                    this.props.textStyle,
                                    this.props.icon ? { marginLeft: 41 } : null,
                                ]}
                                defaultValue={this.props.defaultValue}
                                value={this.state.text}
                                maxLength={this.props.maxLength}
                                onFocus={() => this.setFocus()}
                                onBlur={() => this.unsetFocus()}
                                onChangeText={value => this.setText(value)}
                            />
                        </TextFieldHolder>
                    </View>
                </View>
            </View>
        );
    }

    inputRef() {
        return this.refs.input;
    }

    focus() {
        this.inputRef().focus();
    }

    blur() {
        this.inputRef().blur();
    }

    isFocused() {
        return this.inputRef().isFocused();
    }

    clear() {
        this.inputRef().clear();
    }

    setFocus() {
        this.setState({
            focused: true,
        });
        try {
            return this.props.onFocus();
        } catch (_error) { }
    }

    unsetFocus() {
        this.setState({
            focused: false,
        });
        try {
            return this.props.onBlur();
        } catch (_error) { }
    }

    labelStyle() {
        if (this.state.focused) {
            return this.props.focusedLabelStyle || styles.focused;
        }
    }

    placeholderValue() {
        if (this.state.text) {
            return this.props.placeholder;
        }
    }

    setText(value) {
        this.setState({
            text: value,
        });
        try {
            return this.props.onChangeTextValue(value);
        } catch (_error) { }
    }
}

const outline = Platform.OS === 'web' ? { outline: '0' } : null;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    viewContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    floatingLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    fieldLabel: {
        fontSize: 16,
        color: '#B1B1B1',
    },
    fieldContainer: {
        flex: 1,
        justifyContent: 'center',
        position: 'relative',
    },
    withBorder: {
        borderBottomWidth: 1 / 2,
        borderColor: '#C8C7CC',
    },
    valueText: {
        flexGrow: 1,
        textAlignVertical: 'top',
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: 'transparent',
        fontSize: 16,
        color: '#111111',
        ...outline,
    },
    focused: {
        color: '#1482fe',
    },
    icon: {
        width: 21,
        height: 21,
        resizeMode: 'contain',
        marginRight: 20,
        marginTop: 2,
    },
});

export default FloatLabelTextField;

FloatLabelTextField.defaultProps = {
    contentInset: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    marginAnim: 30,
    marginMultiline: 20,
};

/* FloatLabelTextField.propTypes = {
    contentInset: React.PropTypes.shape({
        top:  React.PropTypes.number,
        left:  React.PropTypes.number,
        right:  React.PropTypes.number,
        bottom:  React.PropTypes.number,
    }),
    marginAnim: React.PropTypes.number,
    marginMultiline: React.PropTypes.number,
}; */
