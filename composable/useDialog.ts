const dialogState = ref<boolean>(false);
const component = shallowRef();
const componentProps = ref();
const componentEvents = ref();
export const useDialog = () => {
  const showComponent = ({
    componentToShow,
    props,
    events,
  }: {
    componentToShow: any;
    props: any;
    events: any;
  }) => {
    component.value = componentToShow;
    componentProps.value = props;
    componentEvents.value = events;
    dialogState.value = true;
  };
  const hideComponent = () => {
    component.value = {};
    componentProps.value = {};
    componentEvents.value = {};
    dialogState.value = false;
  };
  return {
    dialogState,
    component,
    componentProps,
    componentEvents,
    showComponent,
    hideComponent,
  };
};
