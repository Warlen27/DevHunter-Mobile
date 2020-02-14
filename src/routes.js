import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import Profile from './pages/Profile';

const Routes = createAppContainer(
    createStackNavigator({
        Main: {
            screen: Main,
            navigationOptions: {
                title: 'DevHunter',
                
            },
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                title: 'Perfil no Github'
            },
        }, 
    }, {
        defaultNavigationOptions: {
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: '#191919',
            },
        },
    },)
);

export default Routes;