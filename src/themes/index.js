import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { pink, blue } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
    type: 'dark'
  },
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: "#303030",
        color: '#fff'
      }
    },
    MuiStepper: {
      horizontal: {
        backgroundColor: '#303030'
      },
    }
  }
});

export default theme;