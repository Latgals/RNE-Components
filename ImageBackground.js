/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
'use strict';

const Image = require('Image');
const React = require('React');
const StyleSheet = require('StyleSheet');
const View = require('View');

const ensureComponentIsNative = require('ensureComponentIsNative');

/**
 * Very simple drop-in replacement for <Image> which supports nesting views.
 * Очень простая замена вставки <Image>, которая поддерживает вложенные представления.
 *
 * ```ReactNativeWebPlayer
 * import React, { Component } from 'react';
 * import { AppRegistry, View, ImageBackground, Text } from 'react-native';
 *
 * class DisplayAnImageBackground extends Component {
 *   render() {
 *     return (
 *       <ImageBackground
 *         style={{width: 50, height: 50}}
 *         source={{uri: 'https://facebook.github.io/react-native/img/opengraph.png'}}
 *       >
 *         <Text>React</Text>
 *       </ImageBackground>
 *     );
 *   }
 * }
 *
 * // App registration and rendering
 * AppRegistry.registerComponent('DisplayAnImageBackground', () => DisplayAnImageBackground);
 * ```
 */
class ImageBackground extends React.Component<$FlowFixMeProps> {
  setNativeProps(props: Object) {
    // Work-around flow
    const viewRef = this._viewRef;
    if (viewRef) {
      ensureComponentIsNative(viewRef);
      viewRef.setNativeProps(props);
    }
  }

  _viewRef: ?React.ElementRef<typeof View> = null;

  _captureRef = ref => {
    this._viewRef = ref;
  };

  render() {
    const {children, style, imageStyle, imageRef, ...props} = this.props;

    return (
      <View
        accessibilityIgnoresInvertColors={true}
        style={style}
        ref={this._captureRef}>
        <Image
          {...props}
          style={[
            StyleSheet.absoluteFill,
            {
               // Временное решение:
               // Текущая (пока несовершенная) реализация <Image> перезаписывает стили ширины и высоты
               // (что не совсем правильно), и эти стили конфликтуют с явно установленными стилями
               // из <ImageBackground> и с нашей внутренней моделью макета здесь.
               // Итак, мы должны прокси / повторно применить эти стили явно для фактического компонента <Image>.
               // Этот обходной путь должен быть удален после реализации надлежащей поддержки
               // внутренний размер содержимого <Image>.
              width: style.width,
              height: style.height,
            },
            imageStyle,
          ]}
          ref={imageRef}
        />
        {children}
      </View>
    );
  }
}

module.exports = ImageBackground;
