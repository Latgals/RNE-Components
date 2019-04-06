## Справка по свойству Navigation

Каждый компонент `screen` в вашем приложении предоставляется с параметром `navigation` автоматически. Параметр содержит различные вспомогательные функции, которые направляют действия навигации по маршруту маршрутизатора. Это выглядит так:

-`this.props.navigation`
  - `navigate` - перейти на другой экран, выяснить действия, которые необходимо предпринять, чтобы сделать это
  - `goBack` - закрыть активный экран и вернуться в стек
  - `addListener` - подписаться на обновления жизненного цикла навигации
  - `isFocused`- функция, которая возвращает, `true` если экран сфокусирован и `false` иначе.
  - `state` - текущее состояние/маршруты
  - `setParams` - внести изменения в параметры маршрута
  - `getParam` - получить конкретный параметр с откатом
  - `dispatch` - отправить действие на роутер
  - `dangerouslyGetParent` - функция, которая возвращает родительский навигатор, если есть

Важно подчеркнуть, что `navigation` не передается всем компонентам - только компоненты `screen` получают этот параметр автоматически! ReactNavigation здесь не делает ничего волшебного. Например, если вы создадите `MyBackButton` компонент и представите его как дочерний компонент экрана, вы не сможете получить доступ к `navigation`. Однако, если вы хотите получить доступ к `navigation` в любом из ваших компонентов, вы можете использовать `withNavigation` HOC_*)_.

    _*) HOC - Higher Order Componenys - компоненты высшего порядка_

###### Навигатор-зависимые функции

Есть несколько дополнительных функций, основанных на this.props.navigation-типе текущего навигатора.

Если навигатор является стековым навигатором, предоставляется несколько вариантов `navigate` и `goBack`, и вы можете использовать то, что предпочитаете. Это функции:

- `this.props.navigation`
  - `push` - протолкнуть новый маршрут в стек
  - `pop` - вернуться в стек
  - `popToTop` - перейти на вершину стека
  - `replace` - заменить текущий маршрут новым
  - `reset` - стереть состояние навигатора и заменить его результатом нескольких действий
  - `dismiss` - отклонить текущий стек

Если навигатор является drawer-навигатором, также доступны дополнительные функции:

    - `openDrawer` - открой drawer
    - `closeDrawer` - закрой drawer
    - `toggleDrawer` - переключать состояние, т.е. переключиться с закрытого на открытый и наоборот

**Общая ссылка на API**

Подавляющее большинство ваших взаимодействий с `navigation` будет включать в себя `navigate`, `goBack`, `state` и `setParams/getParams`.

`navigate` - Ссылка на другие экраны
Позвоните по этой ссылке, чтобы перейти на другой экран в вашем приложении. Принимает следующие аргументы:

navigation.navigate({ routeName, params, action, key })

ИЛИ ЖЕ

navigation.navigate(routeName, params, action)

routeName - Имя маршрута назначения, которое было зарегистрировано где-то в маршрутизаторе приложения
params - параметры для слияния с маршрутом назначения
action- (дополнительно) Поддействие для запуска в дочернем маршрутизаторе, если на экране находится навигатор. См. Actions Doc для получения полного списка поддерживаемых действий.
key- Необязательный идентификатор того, по какому маршруту идти. Перейдите обратно к этому маршруту, если он уже существует
class HomeScreen extends React.Component {
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View>
        <Text>This is the home screen of the app</Text>
        <Button
          onPress={() => navigate('Profile', { name: 'Brent' })}
          title="Go to Brent's profile"
        />
      </View>
    );
  }
}
goBack - Закройте активный экран и вернитесь назад.
При желании укажите ключ, который указывает маршрут для возврата. По умолчанию goBackзакроет маршрут, с которого он вызывается. Если цель состоит в том, чтобы вернуться куда-либо без указания того, что закрывается, вызовите .goBack(null);Обратите внимание, что этот nullпараметр полезен в случае вложенного StackNavigatorsвозврата к родительскому навигатору, когда у дочернего навигатора уже есть только один элемент в стеке. Не беспокойтесь, если это сбивает с толку, этот API требует некоторой работы.

class HomeScreen extends React.Component {
  render() {
    const { goBack } = this.props.navigation;
    return (
      <View>
        <Button onPress={() => goBack()} title="Go back from this HomeScreen" />
        <Button onPress={() => goBack(null)} title="Go back anywhere" />
        <Button
          onPress={() => goBack('screen-123')}
          title="Go back from screen-123"
        />
      </View>
    );
  }
}
Возвращаясь с определенного экрана с goBack
Рассмотрим следующую историю стека навигации:

navigation.navigate(SCREEN_KEY_A);
navigation.navigate(SCREEN_KEY_B);
navigation.navigate(SCREEN_KEY_C);
navigation.navigate(SCREEN_KEY_D);
Теперь вы находитесь на экране D и хотите вернуться к экрану A (нажмите D, C и B). Затем вам нужно предоставить ключ для возврата из :

navigation.goBack(SCREEN_KEY_B) // will go to screen A FROM screen B
В качестве альтернативы, поскольку экран A является вершиной стека, вы можете использовать navigation.popToTop().

addListener - Подписаться на обновления для жизненного цикла навигации
React Navigation генерирует события для компонентов экрана, которые подписываются на них:

willFocus - экран будет фокусироваться
didFocus - экран сфокусирован (если был переход, переход завершен)
willBlur - экран будет не сфокусирован
didBlur - экран не сфокусирован (если был переход, переход завершен)
Пример:

const didBlurSubscription = this.props.navigation.addListener(
  'didBlur',
  payload => {
    console.debug('didBlur', payload);
  }
);

// Remove the listener when you are done
didBlurSubscription.remove();
Полезная нагрузка JSON:

{
  action: { type: 'Navigation/COMPLETE_TRANSITION', key: 'StackRouterRoot' },
  context: 'id-1518521010538-2:Navigation/COMPLETE_TRANSITION_Root',
  lastState: undefined,
  state: undefined,
  type: 'didBlur',
};
Вы также можете подписаться на события навигации декларативно с помощью <NavigationEvents/>компонента.

isFocused - Запрос сфокусированного состояния экрана
Возвращает, trueесли экран сфокусирован и falseиначе.

let isFocused = this.props.navigation.isFocused();
Вы, вероятно, захотите использовать с NavigationFocus вместо того, чтобы использовать это напрямую, он передаст isFocusedбулеву опору вашему компоненту.

state - Текущее состояние экрана / маршрут
Экран имеет доступ к своему маршруту через this.props.navigation.state. Каждый вернет объект со следующим:

{
  // the name of the route config in the router
  routeName: 'profile',
  //a unique identifier used to sort routes
  key: 'main0',
  //an optional object of string options for this screen
  params: { hello: 'world' }
}
Это чаще всего используется для доступа paramsк экрану, переданному через navigateили setParams.

class ProfileScreen extends React.Component {
  render() {
    return <Text>Name: {this.props.navigation.state.params.name}</Text>;
  }
}
setParams - внести изменения в параметры маршрута
Запуск setParamsдействия позволяет экрану изменять параметры маршрута, что полезно для обновления кнопок заголовка и заголовка. setParamsработает как React setState- объединяет предоставленный объект params с текущими params.

class ProfileScreen extends React.Component {
  render() {
    return (
      <Button
        onPress={() => this.props.navigation.setParams({ name: 'Lucy' })}
        title="Set title name to 'Lucy'"
      />
    );
  }
}
getParam - Получить конкретное значение параметра с запасным вариантом
В прошлом вы, возможно, сталкивались с ужасным сценарием доступа к paramкогда paramsнеопределено. Вместо прямого доступа к параметру, вы можете позвонить getParam.

До:

const { name } = this.props.navigation.state.params;
если paramsесть undefined, это не удается

После:

const name = this.props.navigation.getParam('name', 'Peter');
если nameили paramне определены, установите запасной вариант Peter.

Действия стека
Следующие действия будут работать в любом стековом навигаторе:

От себя
Как и при навигации, push перемещает вас вперед к новому маршруту в стеке. Это отличается от того, navigateчто navigate willвсплывает назад в более ранний в стеке, если там уже присутствует маршрут с заданным именем. pushвсегда будет добавляться сверху, поэтому маршрут может присутствовать несколько раз.

navigation.push(routeName, params, action)

routeName - Имя маршрута назначения, которое было зарегистрировано где-то в маршрутизаторе приложения
params - параметры для слияния с маршрутом назначения
action- (дополнительно) Поддействие для запуска в дочернем маршрутизаторе, если на экране находится навигатор. См. Actions Doc для получения полного списка поддерживаемых действий.
поп
Перенесем вас на предыдущий экран в стеке. Если вы укажете число «n», оно будет указывать, сколько экранов заберет вас обратно в стек.

navigation.pop(n)

PopToTop
Вызовите это, чтобы вернуться к верхнему маршруту в стеке, закрывая все остальные экраны.

navigation.popToTop()

замещать
Вызовите это, чтобы заменить текущий экран заданным маршрутом, с параметрами и дополнительным действием.

navigation.replace(routeName, params, action)

Сброс
Протрите состояние навигатора и замените его результатом нескольких действий.

navigation.reset([NavigationActions.navigate({ routeName: 'Profile' })], 0)

отклонять
Вызывайте это, если вы находитесь во вложенном (дочернем) стеке и хотите удалить весь стек, возвращаясь к родительскому стеку.

navigation.dismiss()

Справочник по расширенному API
Эта dispatchфункция используется гораздо реже, но это хороший запасной люк, если вы не можете делать то, что вам нужно, navigateи goBack.

dispatch - Отправить действие на роутер
Используйте диспетчеризацию для отправки любых действий навигации на маршрутизатор. Другие функции навигации используют диспетчеризацию за сценой.

Обратите внимание, что если вы хотите отправлять действия по реагированию на навигацию, вам следует использовать создателей действий, представленных в этой библиотеке.

Посмотрите Документы Действия Навигации для полного списка доступных действий.

import { NavigationActions } from 'react-navigation';

const navigateAction = NavigationActions.navigate({
  routeName: 'Profile',
  params: {},

  // navigate can have a nested navigate action that will be run inside the child router
  action: NavigationActions.navigate({ routeName: 'SubProfileRoute' }),
});
this.props.navigation.dispatch(navigateAction);
dangerouslyGetParent - получить родительский навигатор
Если, например, у вас есть экранный компонент, который может быть представлен в нескольких навигаторах, вы можете использовать его, чтобы влиять на его поведение в зависимости от того, в каком навигаторе он находится.

Еще один хороший пример использования этого - найти индекс активного маршрута в списке маршрутов родителя. Таким образом, в случае стека, если вы находитесь с индексом 0, вы можете не отображать кнопку возврата, но если вы находитесь где-то еще в списке, вы бы отобразили кнопку возврата.

Обязательно всегда проверяйте, что вызов возвращает правильное значение.

class UserCreateScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const parent = navigation.dangerouslyGetParent();
    const gesturesEnabled =
      parent &&
      parent.state &&
      parent.state.routeName === 'StackWithEnabledGestures';

    return {
      title: 'New User',
      gesturesEnabled
    };
  };
}

