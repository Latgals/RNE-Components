FlatList
========

Производительный интерфейс для рендеринга простых, плоских списков, поддерживающий самые удобные функции:

- Полностью кроссплатформенный.
- При необходимости горизонтальный режим.
- Настраиваемая возможность просмотра обратных вызовов.
- Поддержка заголовка.
- Поддержка нижнего колонтитула.
- Поддержка разделителя.
- Потянуть, чтобы обновить состояние.
- Загрузка по мере прокрутки.
- Поддержка ScrollToIndex.

Если вам нужна поддержка списка, используйте <SectionList>.

Минимальный шаблон:

<FlatList
  data={[{key: 'a'}, {key: 'b'}]}
  renderItem={({item}) => <Text>{item.key}</Text>}
/>

Более сложный пример с несколькими вариантами настройки, демонстрирующий использование PureComponent (ЧистогоКомпонента) для оптимизации представления и избежания ошибок.

- При связывании обработчика onPressItem свойства props сохраняются === и PureComponent предотвращает расточительный ре-рендеринг, если реквизиты id, selected или title не изменяются, даже если компоненты, обработанные в MyListItem не оптимизируются.
- Переходя от extraData={this.state} к FlatList мы уверены, что FlatList сам будет повторно обрабатывать изменения state.selected. Без установки этого реквизита, FlatList не знал бы, что он должен повторно визуализировать какие-либо элементы, потому что это также PureComponent и сравнение prop не покажет никаких изменений.
- keyExtractor указывает списку использовать для ключей id вместо свойства key по умолчанию.

    class MyListItem extends React.PureComponent {
      _onPress = () => {
        this.props.onPressItem(this.props.id);
      };

      render() {
        const textColor = this.props.selected ? "red" : "black";
        return (
          <TouchableOpacity onPress={this._onPress}>
            <View>
              <Text style={{ color: textColor }}>
                {this.props.title}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }
    }

    class MultiSelectList extends React.PureComponent {
      state = {selected: (new Map(): Map<string, boolean>)};

      _keyExtractor = (item, index) => item.id;

      _onPressItem = (id: string) => {
        // updater functions are preferred for transactional updates
        this.setState((state) => {
          // copy the map rather than modifying state.
          const selected = new Map(state.selected);
          selected.set(id, !selected.get(id)); // toggle
          return {selected};
        });
      };

      _renderItem = ({item}) => (
        <MyListItem
          id={item.id}
          onPressItem={this._onPressItem}
          selected={!!this.state.selected.get(item.id)}
          title={item.title}
        />
      );

      render() {
        return (
          <FlatList
            data={this.props.data}
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
        );
      }
    }
    
Это удобная оболочка вокруг <VirtualizedList> и, таким образом, она наследует его свойства (а также свойства <ScrollView>), которые здесь явно не перечислены, а также имеет следующие особенности:

- Внутреннее состояние не сохраняется, когда содержимое прокручивается из окна рендеринга. Убедитесь, что все ваши данные записаны в данные об элементах или во внешних хранилищах, таких как Flux, Redux или Relay.
- Это PureComponent означает, что он не будет перерисовываться, если props не изменяются. Убедитесь, что все, от чего  зависит ваша функция renderItem, передается как подпорка (например extraData, не === после обновлений), иначе ваш пользовательский интерфейс может не обновляться при изменениях. Это включает в себя состояние data и родительского компонента.
- Чтобы ограничить память и включить плавную прокрутку, контент отображается асинхронно вне экрана. Это означает, что можно прокрутить быстрее, чем скорость заполнения, и на мгновение увидеть пустой контент. Это компромисс, который можно настроить в соответствии с потребностями каждого приложения, и мы работаем над его улучшением.
- По умолчанию в списке ищется реквизит key каждого элемента и используется как ключ. Кроме того, вы можете предоставить собственное свойство keyExtractor.
- Также наследует ScrollView Props, если он не вложен в другой FlatList той же ориентации.

PROPS

  VirtualizedList props...

      ScrollView props...

        View props...

        alwaysBounceVertical
        contentContainerStyle
        keyboardDismissMode
        keyboardShouldPersistTaps
        onContentSizeChange
        onMomentumScrollBegin
        onMomentumScrollEnd
        onScroll
        onScrollBeginDrag
        onScrollEndDrag
        pagingEnabled
        refreshControl
        scrollEnabled
        showsHorizontalScrollIndicator
        showsVerticalScrollIndicator
        stickyHeaderIndices
        endFillColor
        overScrollMode
        scrollPerfTag
        alwaysBounceHorizontal
        automaticallyAdjustContentInsets
        bounces
        bouncesZoom
        canCancelContentTouches
        centerContent
        contentInset
        contentInsetAdjustmentBehavior
        contentOffset
        decelerationRate
        directionalLockEnabled
        indicatorStyle
        maximumZoomScale
        minimumZoomScale
        pinchGestureEnabled
        scrollEventThrottle
        scrollIndicatorInsets
        scrollsToTop
        snapToAlignment
        snapToInterval
        snapToOffsets
        snapToStart
        snapToEnd
        zoomScale
        nestedScrollEnabled
        
        Methods:
        
        scrollTo
        scrollToEnd
        scrollWithoutAnimationTo
        flashScrollIndicators
  
    getItem
    getItemCount
    debug
    CellRendererComponent
    onLayout
    renderScrollComponent
    maxToRenderPerBatch
    updateCellsBatchingPeriod
    windowSize
    disableVirtualization

renderItem
data
ItemSeparatorComponent
ListEmptyComponent
ListFooterComponent
ListHeaderComponent
columnWrapperStyle
extraData
getItemLayout
horizontal
initialNumToRender
initialScrollIndex
inverted
keyExtractor
numColumns
onEndReached
onEndReachedThreshold
onRefresh
onViewableItemsChanged
progressViewOffset
legacyImplementation
refreshing
removeClippedSubviews
viewabilityConfig
viewabilityConfigCallbackPairs

Методы

scrollToEnd
scrollToIndex
scrollToItem
scrollToOffset
recordInteraction
flashScrollIndicators



PROPS

* renderItem={function} - Обязательна

renderItem({ 
  item: Object, 
  index: number, 
  separators: { 
    highlight: Function, 
    unhighlight: Function, 
    updateProps: Function(select: string, newProps: Object) 
  } 
}) => ?React.Element

Берет элемент data и отображает его в списке.

Предоставляет дополнительные метаданные, например, index, если вам это нужно, а также более общую separators.updateProps функцию, которая позволяет вам устанавливать любые реквизиты, которые вы хотите изменить, для рендеринга либо ведущего, либо конечного разделителя в случае, если более распространенного highlight и unhighlight(который устанавливает highlighted: boolean пропеллер) недостаточно для вашего случая использования.

Пример использования:

<FlatList
  ItemSeparatorComponent={Platform.OS !== 'android' && ({highlighted}) => (
    <View style={[style.separator, highlighted && {marginLeft: 0}]} />
  )}
  data={[{title: 'Title Text', key: 'item1'}]}
  renderItem={({item, separators}) => (
    <TouchableHighlight
      onPress={() => this._onPress(item)}
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}>
      <View style={{backgroundColor: 'white'}}>
        <Text>{item.title}</Text>
      </View>
    </TouchableHighlight>
  )}
/>


* data={array} - Обязателен

Для простоты data - это просто массив. Если вы хотите использовать что-то еще, например, неизменный список, используйте базовый инструмент VirtualizedList напрямую.


* ItemSeparatorComponent={Component}

Отображается между каждым элементом, но не сверху или снизу. По умолчанию highlighted и leadingItem реквизиты предоставляются. renderItem обеспечивает separators.highlight/unhighlight который обновит highlighted реквизит, но вы также можете добавить свой реквизит с помощью separators.updateProps.


* ListEmptyComponent={component, function, element}

Отображается, когда список пуст. Может быть классом компонентов React, функцией визуализации или визуализированным элементом.


* ListFooterComponent={component, function, element}

Оказывается в нижней части всех предметов. Может быть классом компонентов React, функцией визуализации или визуализированным элементом.


* ListHeaderComponent={component, function, element}

Оказывается в верхней части всех предметов. Может быть классом компонентов React, функцией визуализации или визуализированным элементом.


* columnWrapperStyle={style object}

Необязательный пользовательский стиль для строк, состоящих из нескольких элементов когда numColumns > 1


* extraData={любой тип данных}

Свойство маркера, позволяющее повторно отображать список (поскольку он реализуется PureComponent). Если какая-либо из ваших renderItem функций, функций «Верхний колонтитул», «Нижний колонтитул» и т. Д. Зависит от чего-либо, находящегося за пределами data опоры, прикрепите ее здесь и относитесь к ней неизменно


* getItemLayout={function}

(data, index) => {length: number, offset: number, index: number}

getItemLayout опциональная оптимизация, которая позволяет нам пропустить измерение динамического контента, если вы заранее знаете высоту элементов. getItemLayout эффективен и прост в использовании, если у вас есть предметы фиксированной высоты, например:

  getItemLayout={(data, index) => (
    {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
  )}
  
Добавление getItemLayout может значительно повысить производительность для списков из нескольких сотен элементов. Не забудьте включить длину разделителя (высоту или ширину) в расчет смещения, если вы укажете ItemSeparatorComponent.


* horizontal={boolean}

Если значение равно true, элементы располагаются рядом друг с другом по горизонтали, а не по вертикали.


* initialNumToRender={число}

Сколько элементов визуализировать в исходной партии. Этого должно быть достаточно для заполнения экрана, но не намног. Обратите внимание, что эти элементы никогда не будут размонтированы как часть оконного рендеринга, чтобы улучшить воспринимаемую производительность действий прокрутки вверх.


* initialScrollIndex={число}

Вместо того, чтобы начинать сверху с первого пункта, начните с initialScrollIndex. Это отключает оптимизацию «прокрутки вверх», которая сохраняет первые initialNumToRender элементы всегда отображаемыми и немедленно отображает элементы, начиная с этого начального индекса. Требуется getItemLayout быть реализованным.


* inverted={boolean}

Меняет направление прокрутки. Использует масштабные преобразования -1.


* keyExtractor={function}

(item: object, index: number) => string;

Используется для извлечения уникального ключа для данного элемента по указанному индексу. Ключ используется для кэширования и в качестве ключа реакции для отслеживания переупорядочения элементов. Экстрактор по умолчанию проверяет item.key, затем возвращается к использованию индекса, как это делает React.


* numColumns={число}

Несколько столбцов могут отображаться только в случае horizontal={false} в зигзагообразном поряке, как макет flexWrap. Все элементы должны быть одинаковой высоты - макеты типа кирпичной кладки не поддерживаются.


* onEndReached={function}

(info: {distanceFromEnd: number}) => void

Вызывается один раз, когда позиция прокрутки попадает в onEndReachedThreshold от ображаемый контент.


* onEndReachedThreshold={число}

Как далеко от конца содержимого (в единицах видимой длины списка) должен находиться нижний край списка, чтобы вызвать обратный вызов onEndReached. Таким образом, например, при значении 0,5 onEndReached будет срабатывать, когда конец содержимого находится в пределах половины видимой длины списка.


* onRefresh={function}

() => void
Если используется, стандартный RefreshControl будет добавлен к функциональности «Pull to Refresh». Не забудьте также корретно установить параметр refreshing.


* onViewableItemsChanged={function}

(info: {
    viewableItems: array,
    changed: array,
  }) => void
  
Вызывается, когда видимость строк изменяется, как определено реквизитом viewabilityConfig.


* progressViewOffset={число}  - для Android

Установите это, когда необходимо смещение, чтобы правильно индикатор загрузки отображался.


* legacyImplementation={boolean}

Может не иметь полной четности функций и предназначена для отладки и сравнения производительности.


* refreshing={boolean}

Установите это значение в ожидании новых данных из обновления.


* removeClippedSubviews={boolean}

Это может улучшить производительность прокрутки для больших списков.
Примечание: в некоторых случаях могут быть ошибки (отсутствующий контент) - используйте на свой страх и риск.


* viewabilityConfig={ViewabilityConfig}

Смотрите ViewabilityHelper.js для определения типа и дополнительную документацию.

viewabilityConfig принимает тип ViewabilityConfigо бъект со следующими свойствами:
  minimumViewTime	- число
  viewAreaCoveragePercentThreshold - число
  itemVisiblePercentThreshold - число
  waitForInteraction - boolean
  
Обязателен по крайней мере, один из viewAreaCoveragePercentThreshold или itemVisiblePercentThreshold. Это необходимо сделать во constructorизбежание следующей ошибки ( ref ):
  
  Error: Changing viewabilityConfig on the fly is not supported
  
constructor (props) {
  super(props)

  this.viewabilityConfig = {
      waitForInteraction: true,
      viewAreaCoveragePercentThreshold: 95
  }
}
<FlatList
    viewabilityConfig={this.viewabilityConfig}
  ...
  
  
  - minimumViewTime
      Минимальное количество времени (в миллисекундах), в течение которого элемент должен быть физически видимым, прежде чем будет вызван обратный вызов видимости. Большое число означает, что прокрутка контента без остановки не помечает контент как видимый.
  - viewAreaCoveragePercentThreshold
      Процент области просмотра, которая должна быть закрыта, чтобы частично закрытый элемент считался «видимым», 0-100. Полностью видимые предметы всегда считаются видимыми. Значение 0 означает, что один пиксель в окне просмотра делает элемент видимым, а значение 100 означает, что элемент должен быть либо полностью видимым, либо покрывать весь видовой экран, чтобы считаться видимым.
  - itemVisiblePercentThreshold
      Аналогично viewAreaPercentThreshold, но учитывает процент видимого элемента, а не долю видимой области, которую он покрывает.
   - waitForInteraction
      Ничто не считается видимым, пока пользователь не прокрутит или recordInteractionне вызовет после рендера.

      
      
* viewabilityConfigCallbackPairs={массив ViewabilityConfigCallbackPair}

Список ViewabilityConfig/onViewableItemsChangedпар. Конкретный onViewableItemsChangedбудет вызван, когда будут выполнены соответствующие ViewabilityConfigусловия. Смотрите ViewabilityHelper.js тип потока и дополнительную документацию.




МЕТОДЫ


* scrollToEnd()

scrollToEnd([params]);

Прокрутка до конца контента. Может быть дергаться без свойства getItemLayout.

Параметры:
params    Object    Необязательный

Допустимые ключи params:
'animated' (boolean) - должен ли список выполнять анимацию при прокрутке. По умолчанию true.


* scrollToIndex()

scrollToIndex(params);

Прокручивает до элемента по указанному индексу, так что он располагается в видимой области. viewPosition 0 помещает его сверху, 1 внизу и 0,5 по центру в середине.
Примечание. Невозможно прокрутить места за пределами окна рендеринга, не указав getItemLayoutреквизит.

Параметры:
params    Object    Обязательный

Допустимые ключи params:
'animated' (boolean) - должен ли список выполнять анимацию при прокрутке. По умолчанию true.
'index' (число) - индекс для прокрутки. Обязателен.
'viewOffset' (число) - фиксированное количество пикселей для смещения конечной целевой позиции. Обязателен.
'viewPosition' (число) - значение 0 помещает элемент, указанный индексом вверху, 1 внизу и 0.5 по центру в середине.


* scrollToItem()

scrollToItem(params);

Требует линейного сканирования данных - используйте scrollToIndex вместо этого, если это возможно.
Примечание. Невозможно прокрутить места за пределами окна рендеринга, не указав getItemLayoutреквизит.

Параметры:
params    Object    Обязательный

Допустимые ключи params:
'animated' (boolean) - должен ли список выполнять анимацию при прокрутке. По умолчанию true.
'item' (object) - элемент для прокрутки. Обязателен.
'viewPosition' (число)


* scrollToOffset()

scrollToOffset(params);

Прокрутка содержимого в списке на определенное число пикселей (смещение).

Параметры:
params    Object    Обязательный

Допустимые ключи params:
'offset' (число) - смещение для прокрутки. В случае horizontal, смещение является значением x, в другом случае смещение является значением y. Обязателен.
'animated' (логическое) - должен ли список выполнять анимацию при прокрутке. По умолчанию true.


* recordInteraction()

recordInteraction();

Сообщает списку, что произошло взаимодействие, которое должно инициировать вычисления видимости. Например, если waitForInteractions истинно, а пользователь не прокрутил. Обычно это вызывается касаниями предметов или навигационными действиями.


* flashScrollIndicators()

flashScrollIndicators();

Отображает индикаторы прокрутки на мгновение.



======================

// EOF
