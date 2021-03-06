import GameOfLife, {
    CellStatus,
    GameStatus
} from "../gameOfLife";
import {
    configureStore
} from "@reduxjs/toolkit";
import {
    Cell
} from "../../collections/grid";
interface GameStateActionTick {
    type: 'tick';
}

interface GameStateActionReset {
    type: 'reset';
}

interface GameStateActionHardReset {
    type: 'hardreset';
    isMobile: boolean;
}

interface GameStateActionChangeCell {
    type: 'changecell';
    cell: Cell < CellStatus > ;
    value: CellStatus;
}

type GameStateAction = GameStateActionTick | GameStateActionReset | GameStateActionHardReset | GameStateActionChangeCell;

const gameStateReducer = (state: GameOfLife = new GameOfLife(), action: GameStateAction): GameOfLife => {
    let newState = GameOfLife.clone(state);
    switch (action.type) {
        case 'tick':
            newState.tick();
            return newState;
        case 'reset':
            newState.grid.resetGrid();
            return newState;
        case 'changecell':
            newState.grid.setCell(action.cell, action.value);
            return newState;
        case 'hardreset':
            return new GameOfLife(action.isMobile);
        default:
            return newState;
    }
}

interface GameStatusActionStart {
    type: 'start';
}

interface GameStatusActionStop {
    type: 'stop';
}

type GameStatusAction = GameStatusActionStart | GameStatusActionStop;

const gameStatusReducer = (state: GameStatus = GameStatus.STOPPED, action: GameStatusAction): GameStatus => {
    switch (action.type) {
        case 'start':
            return GameStatus.STARTED;
        case 'stop':
            return GameStatus.STOPPED;
        default:
            return state;
    }
}

const store = configureStore({
    reducer: {
        gameStatus: gameStatusReducer,
        gameState: gameStateReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export default store;
export type RootState = ReturnType < typeof store.getState >;
export type GameDispatch = typeof store.dispatch;