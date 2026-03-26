import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, roc_curve, auc, precision_recall_curve

def plot_confusion_matrix(y_true, y_pred, classes):
    """
    Plot confusion matrix using seaborn heatmap and display in window.
    
    Parameters:
    y_true: array-like, true labels
    y_pred: array-like, predicted labels
    classes: list, class names for labels
    """
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=classes, yticklabels=classes)
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.show()

def plot_roc_curve(y_true, y_scores):
    """
    Plot ROC curve and display in window.
    
    Parameters:
    y_true: array-like, true binary labels
    y_scores: array-like, target scores (probabilities or decision function)
    """
    fpr, tpr, _ = roc_curve(y_true, y_scores)
    roc_auc = auc(fpr, tpr)
    plt.figure()
    plt.plot(fpr, tpr, color='darkorange', lw=2, label='ROC curve (area = %0.2f)' % roc_auc)
    plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver Operating Characteristic')
    plt.legend(loc="lower right")
    plt.show()

def plot_precision_recall_curve(y_true, y_scores):
    """
    Plot Precision-Recall curve and display in window.
    
    Parameters:
    y_true: array-like, true binary labels
    y_scores: array-like, target scores (probabilities or decision function)
    """
    precision, recall, _ = precision_recall_curve(y_true, y_scores)
    plt.figure()
    plt.plot(recall, precision, color='blue', lw=2)
    plt.xlabel('Recall')
    plt.ylabel('Precision')
    plt.title('Precision-Recall Curve')
    plt.show()

def plot_accuracy_curve(train_accuracies, val_accuracies, epochs):
    """
    Plot training and validation accuracy over epochs and display in window.
    
    Parameters:
    train_accuracies: list, training accuracies per epoch
    val_accuracies: list, validation accuracies per epoch
    epochs: list, epoch numbers
    """
    plt.figure()
    plt.plot(epochs, train_accuracies, label='Training Accuracy')
    plt.plot(epochs, val_accuracies, label='Validation Accuracy')
    plt.xlabel('Epochs')
    plt.ylabel('Accuracy')
    plt.title('Training and Validation Accuracy')
    plt.legend()
    plt.show()

def plot_loss_curve(train_losses, val_losses, epochs):
    """
    Plot training and validation loss over epochs and display in window.
    
    Parameters:
    train_losses: list, training losses per epoch
    val_losses: list, validation losses per epoch
    epochs: list, epoch numbers
    """
    plt.figure()
    plt.plot(epochs, train_losses, label='Training Loss')
    plt.plot(epochs, val_losses, label='Validation Loss')
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.title('Training and Validation Loss')
    plt.legend()
    plt.show()