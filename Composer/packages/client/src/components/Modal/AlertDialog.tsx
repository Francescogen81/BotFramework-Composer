// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import ReactDOM from 'react-dom';
import formatMessage from 'format-message';

import { dialogStyle, NORMAL_STYLE, CONSOLE_STYLE } from './dialogStyle';

// -------------------- Styles -------------------- //

export const builtInStyles = {
  [dialogStyle.normal]: NORMAL_STYLE,
  [dialogStyle.console]: CONSOLE_STYLE,
};

// -------------------- AlertDialog -------------------- //

type Props = {
  setting: {
    title: string;
    subtitle?: string;
    confirmText?: string;
    style?: string;
  };
  onCancel: () => void;
  onConfirm: () => void;
};

const AlertDialog = (props: Props) => {
  const { setting, onCancel, onConfirm } = props;
  const { title, subtitle = '', confirmText = formatMessage('Ok'), style = dialogStyle.normal } = setting;
  if (!title) {
    throw new Error(formatMessage('Confirmation modal must have a title'));
  }

  return (
    <Dialog
      dialogContentProps={{
        type: DialogType.normal,
        title: title,
        // subText: subTitle,
      }}
      hidden={false}
      minWidth={500}
      modalProps={{
        isBlocking: true,
        styles: {
          main: { maxWidth: 450 },
        },
      }}
      onDismiss={onCancel}
    >
      {subtitle && <div css={builtInStyles[style]}>{subtitle}</div>}

      <DialogFooter>
        <PrimaryButton text={confirmText} onClick={onConfirm} />
      </DialogFooter>
    </Dialog>
  );
};

export const openAlertModal = (title, subtitle, setting = {}) => {
  return new Promise((resolve) => {
    const node = document.createElement('div');
    document.body.appendChild(node);
    const removeNode = () => {
      ReactDOM.unmountComponentAtNode(node);
    };

    const onConfirm = () => {
      removeNode();
      resolve(true);
    };
    const onCancel = () => {
      removeNode();
      resolve(false);
    };

    const modal = <AlertDialog setting={{ title, subtitle, ...setting }} onCancel={onCancel} onConfirm={onConfirm} />;
    ReactDOM.render(modal, node);
  });
};
