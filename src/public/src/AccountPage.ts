import { SendCardToTrashParams } from "../../models/MetadataMongoDB";
import { ICard } from "../../models/mongoose_models/CardSchema";
import { IMetadata } from "../../models/mongoose_models/MetadataCardSchema";
import { IUser } from "../../models/mongoose_models/UserSchema";
import { refreshMetadata, sendHTTPRequest, sendForm } from "./AppUtilities";
import { displayPopUp } from "./CardTemplateUtilities";
import { CardsManager } from "./CardsManager";
import { renderLatex } from "./Latex";
import { addSyntaxHighlighting } from "./SyntaxHighlighting";

interface AccountPageState {
  metadata: IMetadata;
  card_container: HTMLElement;
  trash_button: HTMLElement;
  trashed_card_index: number;
  current_card_id: string | null;
  current_card_title: HTMLElement;
  current_card_description: HTMLElement;
  current_card_tags: HTMLElement;
  current_card_urgency_number: HTMLElement;
  current_card_delete_button: HTMLElement;
  current_card_restore_button: HTMLElement;
}

let state: AccountPageState | null, cardsManager: CardsManager | null;

function initializeAccountPage() {
    refreshMetadata()
        .then(({metadata, minicards}) => {
            state = {
                metadata: metadata,
                card_container: document.getElementById("card_container") as HTMLElement,
                trash_button: document.getElementById("trash_button") as HTMLElement,
                trashed_card_index: 0,
                current_card_id: null,
                current_card_title: document.getElementById("card_title") as HTMLElement,
                current_card_description: document.getElementById("card_description") as HTMLElement,
                current_card_tags: document.getElementById("card_tags") as HTMLElement,
                current_card_urgency_number: document.getElementById("card_urgency_number") as HTMLElement,
                current_card_delete_button: document.getElementById("card_delete_button") as HTMLElement,
                current_card_restore_button: document.getElementById("card_restore_button") as HTMLElement,
            };

            cardsManager = new CardsManager(metadata.node_information[0], metadata.createdById);
            cardsManager.initializeFromTrash(state.metadata.trashed_cards[0]);

            (document.getElementById("trash_button_text") as HTMLElement).innerHTML =
              `<i class="fa fa-trash-o fa-fw" aria-hidden="true"></i> View ${Object.keys(state.metadata.trashed_cards[0]).length} Trashed Cards`;

        })
        .catch((err) => { console.error(err); });
}

function downloadUserData() {
    window.open("/account/download-user-data");
}

function confirmDeletion() {
    if (window.confirm("Deleting your account is irreversible. Continue?")) {
      sendHTTPRequest("POST", "/account/delete-account", {})
            .then((_) => {
                localStorage.clear();
                window.location.href = "/";
            })
            .catch((err) => { console.error(err); });
    }
}

function showCardsFromTrash() {
  if (!state || !cardsManager) {
    throw new Error("Account page not initialized.");
  }

  if (Object.keys(state.metadata.trashed_cards[0]).length === 0) {
    return;
  }


  state.card_container.style.display = "block";
  state.trash_button.style.display = "none";

  cardsManager.initializeFromTrash(state.metadata.trashed_cards[0]);
  cardsManager.next()
    .then((card) => { renderTrashedCard(card); });

}

function closeTrashWindow() {
  if (!state) {
    throw new Error("Account page not initialized.");
  }
  state.trash_button.style.display = "inline";
  state.card_container.style.display = "none";
}

export function fetchNextCard() {
  if (!cardsManager) {
    throw new Error("Account page not initialized.");
  }
  cardsManager.next()
      .then((card) => { renderTrashedCard(card); })
      .catch((err) => { console.error(err); });
}

export function fetchPreviousCard() {
  if (!cardsManager) {
    throw new Error("Account page not initialized.");
  }
  cardsManager.previous()
      .then((card) => { renderTrashedCard(card); })
      .catch((err) => { console.error(err); });
}

function renderTrashedCard(card: Partial<ICard> | null) {
  if (!card) {
    displayPopUp("Out of cards!", 1000);
    return;
  }

  if (!state) {
    throw new Error("Account page not initialized.");
  }

  state.current_card_id = card._id;
  state.current_card_title.innerText = card.title as string;
  state.current_card_description.innerHTML = card.descriptionHTML as string;
  state.current_card_tags.innerText = card.tags?.replace(" ", ", ") || "";
  state.current_card_urgency_number.innerText = `${card.urgency as number}`;

  addSyntaxHighlighting();
  renderLatex(["card_title", "card_description"]);
}

function modifyTrash(endpoint: "/delete-card" | "/restore-from-trash") {
  if (!state || !cardsManager) {
      throw new Error("Account page not initialized.");
  }

  let payload: SendCardToTrashParams = {
    _id: state.current_card_id as string,
    createdById: state.metadata.createdById
  }
  sendHTTPRequest("POST", endpoint, payload)
    .then((confirmation) => {
        displayPopUp(confirmation, 2000);
        (cardsManager as CardsManager).removeCard(payload._id);
        fetchNextCard();
    })
    .catch((err) => { console.error(err); });

}

function updateAccountSettings() {
    sendForm("accountSettingsForm", "/account/update-settings")
        .then((user: IUser) => {
            alert(`Account settings updated at ${user.updatedAt}}`);
        })
        .catch((err) => { console.error(err); });

    return false;
}
