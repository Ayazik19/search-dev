import {
    OverlayScrollbars,
    ScrollbarsHidingPlugin,
    SizeObserverPlugin,
    ClickScrollPlugin,
    Options
} from 'overlayscrollbars';
import { useEffect } from 'react';

const config = {
    // paddingAbsolute: true, // Или false, в зависимости от ваших нужд
    // showNativeOverlaidScrollbars: false, // Если вы хотите скрыть нативные полосы прокрутки
    // update: {
    //     elementEvents: [['.your-element-selector', 'resize']], // Укажите селектор и события
    //     debounce: 100, // Задержка перед обновлением
    //     attributes: ['style', 'class'], // Укажите атрибуты для отслеживания
    //     ignoreMutation: (mutation) => {
    //         // Логика для игнорирования определенных мутаций
    //         return false; // Вернуть true, если нужно игнорировать
    //     }
    // },    overflow: {
    //     x: 'hidden', // Установите нужное значение для горизонтальной прокрутки
    //     y: 'scroll',   // Установите нужное значение для вертикальной прокрутки
    // },
    // scrollbars: {
    //     autoHide: 'scroll', // Укажите значение для автоскрытия
    //     theme: 'dark', // Выберите тему
    //     visibility: 'auto', // Настройка видимости
    //     autoHideDelay: 500, // Задержка перед автоскрытием
    //     autoHideSuspend: false, // Временно отключить автоскрытие
    //     dragScroll: true, // Включить прокрутку перетаскиванием
    //     clickScroll: 'instant', // Режим прокрутки кликами
    //     pointers: ['mouse', 'touch'], // Устройства ввода
    // }
};

export const useScrollBarLoc = (root: React.RefObject<HTMLDivElement>) => {

    useEffect(() => {
        let scrollBars: OverlayScrollbars | undefined;

        if (root.current) {
            scrollBars = OverlayScrollbars(root.current, config)
        }

        return () => {
            if (scrollBars) {
                scrollBars.destroy();
            }
        }
    }, [root]);
}
