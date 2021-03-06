import { h, render, FunctionalComponent, ComponentChild } from 'preact';
import { useEffect } from 'preact/hooks';
import Router, { Route } from 'preact-router';
import { AppContainer } from './containers';
import { SearchBox, Content } from './components';
import GlobalStyle from './styles';
import { Params } from './typings';

export type RouteProps = {
  matches: { [key in keyof Params]: string };
  url: string;
  path: string;
};

const AppComponent: FunctionalComponent<RouteProps &
  ComponentChild> = props => {
  const {
    params,
    fetchSupports,
    handleSetParams,
    isInitial,
    handleSetIsInitial,
  } = AppContainer.useContainer();

  useEffect(() => {
    const { q, industry_category, purpose_category } = props.matches;
    const params = {
      q: q ?? null,
      industry_category: industry_category ? Number(industry_category) : null,
      purpose_category: purpose_category ? Number(purpose_category) : null,
      'prefecture.name': props.matches?.['prefecture.name'] ?? null,
    };
    handleSetParams(params);
    handleSetIsInitial(false);
  }, []);

  useEffect(() => {
    if (!isInitial) {
      fetchSupports(params);
    }
  }, [params]);

  return (
    <div>
      <GlobalStyle />
      <SearchBox {...props} />
      <Content />
    </div>
  );
};

const App: FunctionalComponent = () => {
  const { Provider } = AppContainer;
  return (
    <Provider>
      <Router>
        <Route path="/" component={AppComponent} />
      </Router>
    </Provider>
  );
};

render(<App />, document.getElementById('root'));
