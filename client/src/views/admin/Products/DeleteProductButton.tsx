import React, {ComponentProps} from "react";
// Data and GraphQL
import { Mutation } from "react-apollo";
import { ApolloError } from "apollo-client";
import { DELETE_PRODUCT } from "../../../queries";
// @material-ui/core components
import {WithStyles, CircularProgress, createStyles, Theme} from '@material-ui/core';
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
// @material-ui/icons
import { Delete, Close } from "@material-ui/icons";
// core components
import Button from "../../../components/CustomButtons/Button";
import SnackbarContent from "../../../components/Snackbar/SnackbarContent.jsx";

import modalStyle from "../../../assets/jss/material-kit-react/modalStyle.jsx";

export interface DeleteProductProps extends WithStyles<typeof modalStyle>, ComponentProps<any> {}

const Transition: any = (props: DeleteProductProps) => <Slide direction="down" {...props} />;

const styles = (theme: Theme) => createStyles({
    ...modalStyle,
    progress: {
        margin: theme.spacing.unit * 2,
    },
});

export const deleteProduct = (props: DeleteProductProps, callback: Function) => {
    return <Mutation
        mutation={DELETE_PRODUCT}
        variables={{ id: props.id }}
        refetchQueries={['Products']}
        onCompleted={() => {
            callback();
        }}
        onError={(error: ApolloError) => callback(error.message)}
    >
        {(postMutation, { loading, error }) => {
            if (loading) {
                return <CircularProgress color="primary" className={props.classes.progress} />;
            }

            return <Button
                onClick={postMutation}
                color="success">
                Yes
            </Button>;
        }}
    </Mutation>
};

class DeleteProductButton extends React.Component<any> {
    state: { [index: string] : boolean } = {
        modal: false
    };

    handleClickOpen = () => {
        this.setState({ modal: true });
    };

    handleClose = (error?: string) => {
        if (error) {
            this.setState({ error });
        } else {
            this.setState({ modal: false });
        }
    };

    render() {
        const { classes } = this.props as DeleteProductProps;

        return (
            <span>
                <Button color="rose" onClick={() => this.handleClickOpen()}>
                    <Delete/> Delete
                </Button>

                <Dialog
                    classes={{
                        root: classes.center,
                        paper: classes.modal
                    }}
                    open={this.state.modal}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => this.handleClose()}
                    aria-labelledby="modal-slide-title"
                    aria-describedby="modal-slide-description">
                    <DialogTitle
                        id="classic-modal-slide-title"
                        disableTypography
                        className={classes.modalHeader}>
                        <IconButton
                            className={classes.modalCloseButton}
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={() => this.handleClose()}>
                            <Close className={classes.modalClose} />
                        </IconButton>
                        <h4 className={classes.modalTitle}>Modal title</h4>
                    </DialogTitle>
                    <DialogContent
                        id="modal-slide-description"
                        className={classes.modalBody}>
                        <h5>Are you sure you want to delete this product?</h5>
                        {this.state.error &&
                            <SnackbarContent
                            message={<span><b>{this.state.error}</b></span>}
                                color="danger"
                                icon="warning_outline"
                            />
                        }
                    </DialogContent>
                    <DialogActions
                        className={classes.modalFooter}>
                        <Button
                            onClick={() => this.handleClose()}
                        >
                            Cancel
                        </Button>

                        { deleteProduct(this.props as DeleteProductProps, this.handleClose) }
                    </DialogActions>
                </Dialog>
            </span>
        );
    }
}

export default withStyles(styles)(DeleteProductButton);
