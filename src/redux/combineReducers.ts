// src/redux/combineReducers.ts
import type { AppActions, RootState } from '../types';

type Reducer<S, A> = (state: S | undefined, action: A) => S;

type ReducersMapObject<S, A> = {
  [K in keyof S]: Reducer<S[K], A>;
};

export const combineReducers = <S extends RootState, A extends AppActions>(
  reducers: ReducersMapObject<S, A>
): Reducer<S, A> => {
  return (state: S | undefined, action: A): S => {
    let hasChanged = false;
    const nextState: Partial<S> = {};

    for (let key in reducers) {
      const previousStateForKey = state ? state[key] : undefined;
      const nextStateForKey = reducers[key](previousStateForKey as any, action); // Type assertion for slice state
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return (hasChanged ? nextState : state) as S;
  };
};